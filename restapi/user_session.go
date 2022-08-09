// This file is part of GuinsooLab Console Server
// Copyright (c) 2020-2022 GuinsooLab, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

package restapi

import (
	"bytes"
	"context"
	"encoding/json"
	"strconv"
	"time"

	policies "github.com/GuinsooLab/console/restapi/policy"
	"github.com/minio/madmin-go"

	jwtgo "github.com/golang-jwt/jwt/v4"
	"github.com/minio/pkg/bucket/policy/condition"

	minioIAMPolicy "github.com/minio/pkg/iam/policy"

	"github.com/go-openapi/runtime/middleware"
	"github.com/GuinsooLab/console/models"
	"github.com/GuinsooLab/console/pkg/auth/idp/oauth2"
	"github.com/GuinsooLab/console/pkg/auth/ldap"
	"github.com/GuinsooLab/console/restapi/operations"
	authApi "github.com/GuinsooLab/console/restapi/operations/auth"
)

type Conditions struct {
	S3Prefix []string `json:"s3:prefix"`
}

func registerSessionHandlers(api *operations.ConsoleAPI) {
	// session check
	api.AuthSessionCheckHandler = authApi.SessionCheckHandlerFunc(func(params authApi.SessionCheckParams, session *models.Principal) middleware.Responder {
		sessionResp, err := getSessionResponse(params.HTTPRequest.Context(), session)
		if err != nil {
			return authApi.NewSessionCheckDefault(int(err.Code)).WithPayload(err)
		}
		return authApi.NewSessionCheckOK().WithPayload(sessionResp)
	})
}

func getClaimsFromToken(sessionToken string) (map[string]interface{}, error) {
	jp := new(jwtgo.Parser)
	jp.ValidMethods = []string{
		"RS256", "RS384", "RS512", "ES256", "ES384", "ES512",
		"RS3256", "RS3384", "RS3512", "ES3256", "ES3384", "ES3512",
	}
	var claims jwtgo.MapClaims
	_, _, err := jp.ParseUnverified(sessionToken, &claims)
	if err != nil {
		return nil, err
	}
	return claims, nil
}

// getSessionResponse parse the token of the current session and returns a list of allowed actions to render in the UI
func getSessionResponse(ctx context.Context, session *models.Principal) (*models.SessionResponse, *models.Error) {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// serialize output
	if session == nil {
		return nil, ErrorWithContext(ctx, ErrInvalidSession)
	}
	tokenClaims, _ := getClaimsFromToken(session.STSSessionToken)

	// initialize admin client
	mAdminClient, err := NewMinioAdminClient(&models.Principal{
		STSAccessKeyID:     session.STSAccessKeyID,
		STSSecretAccessKey: session.STSSecretAccessKey,
		STSSessionToken:    session.STSSessionToken,
	})
	if err != nil {
		return nil, ErrorWithContext(ctx, err, ErrInvalidSession)
	}
	userAdminClient := AdminClient{Client: mAdminClient}
	// Obtain the current policy assigned to this user
	// necessary for generating the list of allowed endpoints
	accountInfo, err := getAccountInfo(ctx, userAdminClient)
	if err != nil {
		return nil, ErrorWithContext(ctx, err, ErrInvalidSession)
	}
	erasure := accountInfo.Server.Type == madmin.Erasure
	rawPolicy := policies.ReplacePolicyVariables(tokenClaims, accountInfo)
	policy, err := minioIAMPolicy.ParseConfig(bytes.NewReader(rawPolicy))
	if err != nil {
		return nil, ErrorWithContext(ctx, err, ErrInvalidSession)
	}
	currTime := time.Now().UTC()

	// This actions will be global, meaning has to be attached to all resources
	conditionValues := map[string][]string{
		condition.AWSUsername.Name(): {session.AccountAccessKey},
		// All calls to MinIO from console use temporary credentials.
		condition.AWSPrincipalType.Name():   {"AssumeRole"},
		condition.AWSSecureTransport.Name(): {strconv.FormatBool(getMinIOEndpointIsSecure())},
		condition.AWSCurrentTime.Name():     {currTime.Format(time.RFC3339)},
		condition.AWSEpochTime.Name():       {strconv.FormatInt(currTime.Unix(), 10)},

		// All calls from console are signature v4.
		condition.S3SignatureVersion.Name(): {"AWS4-HMAC-SHA256"},
		// All calls from console are signature v4.
		condition.S3AuthType.Name(): {"REST-HEADER"},
		// This is usually empty, may be set some times (rare).
		condition.S3LocationConstraint.Name(): {GetMinIORegion()},
	}

	claims, err := getClaimsFromToken(session.STSSessionToken)
	if err != nil {
		return nil, ErrorWithContext(ctx, err, ErrInvalidSession)
	}

	// Support all LDAP, JWT variables
	for k, v := range claims {
		vstr, ok := v.(string)
		if !ok {
			// skip all non-strings
			continue
		}
		// store all claims from sessionToken
		conditionValues[k] = []string{vstr}
	}

	defaultActions := policy.IsAllowedActions("", "", conditionValues)

	permissions := map[string]minioIAMPolicy.ActionSet{
		ConsoleResourceName: defaultActions,
	}
	deniedActions := map[string]minioIAMPolicy.ActionSet{}

	var allowResources []*models.PermissionResource

	for _, statement := range policy.Statements {
		for _, resource := range statement.Resources.ToSlice() {
			resourceName := resource.String()
			statementActions := statement.Actions.ToSlice()
			var prefixes []string

			if statement.Effect == "Allow" {
				// check if val are denied before adding them to the map
				var allowedActions []minioIAMPolicy.Action
				if dActions, ok := deniedActions[resourceName]; ok {
					for _, action := range statementActions {
						if len(dActions.Intersection(minioIAMPolicy.NewActionSet(action))) == 0 {
							// It's ok to allow this action
							allowedActions = append(allowedActions, action)
						}
					}
				} else {
					allowedActions = statementActions
				}

				// Add validated actions
				if resourceActions, ok := permissions[resourceName]; ok {
					mergedActions := append(resourceActions.ToSlice(), allowedActions...)
					permissions[resourceName] = minioIAMPolicy.NewActionSet(mergedActions...)
				} else {
					mergedActions := append(defaultActions.ToSlice(), allowedActions...)
					permissions[resourceName] = minioIAMPolicy.NewActionSet(mergedActions...)
				}

				// Allow Permissions request
				conditions, err := statement.Conditions.MarshalJSON()
				if err != nil {
					return nil, ErrorWithContext(ctx, err)
				}

				var wrapper map[string]Conditions

				if err := json.Unmarshal(conditions, &wrapper); err != nil {
					return nil, ErrorWithContext(ctx, err)
				}

				for condition, elements := range wrapper {
					prefixes = elements.S3Prefix

					resourceElement := models.PermissionResource{
						Resource:          resourceName,
						Prefixes:          prefixes,
						ConditionOperator: condition,
					}

					allowResources = append(allowResources, &resourceElement)
				}
			} else {
				// Add new banned actions to the map
				if resourceActions, ok := deniedActions[resourceName]; ok {
					mergedActions := append(resourceActions.ToSlice(), statementActions...)
					deniedActions[resourceName] = minioIAMPolicy.NewActionSet(mergedActions...)
				} else {
					deniedActions[resourceName] = statement.Actions
				}
				// Remove existing val from key if necessary
				if currentResourceActions, ok := permissions[resourceName]; ok {
					var newAllowedActions []minioIAMPolicy.Action
					for _, action := range currentResourceActions.ToSlice() {
						if len(deniedActions[resourceName].Intersection(minioIAMPolicy.NewActionSet(action))) == 0 {
							// It's ok to allow this action
							newAllowedActions = append(newAllowedActions, action)
						}
					}
					permissions[resourceName] = minioIAMPolicy.NewActionSet(newAllowedActions...)
				}
			}
		}
	}
	resourcePermissions := map[string][]string{}
	for key, val := range permissions {
		var resourceActions []string
		for _, action := range val.ToSlice() {
			resourceActions = append(resourceActions, string(action))
		}
		resourcePermissions[key] = resourceActions

	}
	serializedPolicy, err := json.Marshal(policy)
	if err != nil {
		return nil, ErrorWithContext(ctx, err, ErrInvalidSession)
	}
	var sessionPolicy *models.IamPolicy
	err = json.Unmarshal(serializedPolicy, &sessionPolicy)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	sessionResp := &models.SessionResponse{
		Features:        getListOfEnabledFeatures(session),
		Status:          models.SessionResponseStatusOk,
		Operator:        false,
		DistributedMode: erasure,
		Permissions:     resourcePermissions,
		AllowResources:  allowResources,
	}
	return sessionResp, nil
}

// getListOfEnabledFeatures returns a list of features
func getListOfEnabledFeatures(session *models.Principal) []string {
	features := []string{}
	logSearchURL := getLogSearchURL()
	oidcEnabled := oauth2.IsIDPEnabled()
	ldapEnabled := ldap.GetLDAPEnabled()

	if logSearchURL != "" {
		features = append(features, "log-search")
	}
	if oidcEnabled {
		features = append(features, "oidc-idp", "external-idp")
	}
	if ldapEnabled {
		features = append(features, "ldap-idp", "external-idp")
	}

	if session.Hm {
		features = append(features, "hide-menu")
	}
	if session.Ob {
		features = append(features, "object-browser-only")
	}

	return features
}
