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
	"context"
	"errors"
	"fmt"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/restapi/operations"
	bucektApi "github.com/minio/console/restapi/operations/bucket"

	"github.com/minio/madmin-go"

	"github.com/minio/console/models"
)

func registerBucketQuotaHandlers(api *operations.ConsoleAPI) {
	// set bucket quota
	api.BucketSetBucketQuotaHandler = bucektApi.SetBucketQuotaHandlerFunc(func(params bucektApi.SetBucketQuotaParams, session *models.Principal) middleware.Responder {
		err := setBucketQuotaResponse(session, params)
		if err != nil {
			return bucektApi.NewSetBucketQuotaDefault(int(err.Code)).WithPayload(err)
		}
		return bucektApi.NewSetBucketQuotaOK()
	})

	// get bucket quota
	api.BucketGetBucketQuotaHandler = bucektApi.GetBucketQuotaHandlerFunc(func(params bucektApi.GetBucketQuotaParams, session *models.Principal) middleware.Responder {
		resp, err := getBucketQuotaResponse(session, params)
		if err != nil {
			return bucektApi.NewGetBucketQuotaDefault(int(err.Code)).WithPayload(err)
		}
		return bucektApi.NewGetBucketQuotaOK().WithPayload(resp)
	})
}

func setBucketQuotaResponse(session *models.Principal, params bucektApi.SetBucketQuotaParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	if err := setBucketQuota(ctx, &adminClient, &params.Name, params.Body); err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

func setBucketQuota(ctx context.Context, ac *AdminClient, bucket *string, bucketQuota *models.SetBucketQuota) error {
	if bucketQuota == nil {
		return errors.New("nil bucket quota was provided")
	}
	if *bucketQuota.Enabled {
		var quotaType madmin.QuotaType
		switch bucketQuota.QuotaType {
		case models.SetBucketQuotaQuotaTypeHard:
			quotaType = madmin.HardQuota
		default:
			return fmt.Errorf("unsupported quota type %s", bucketQuota.QuotaType)
		}
		if err := ac.setBucketQuota(ctx, *bucket, &madmin.BucketQuota{
			Quota: uint64(bucketQuota.Amount),
			Type:  quotaType,
		}); err != nil {
			return err
		}
	} else {
		if err := ac.Client.SetBucketQuota(ctx, *bucket, &madmin.BucketQuota{}); err != nil {
			return err
		}
	}
	return nil
}

func getBucketQuotaResponse(session *models.Principal, params bucektApi.GetBucketQuotaParams) (*models.BucketQuota, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mAdmin, err := NewMinioAdminClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	// create a minioClient interface implementation
	// defining the client to be used
	adminClient := AdminClient{Client: mAdmin}
	quota, err := getBucketQuota(ctx, &adminClient, &params.Name)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	return quota, nil
}

func getBucketQuota(ctx context.Context, ac *AdminClient, bucket *string) (*models.BucketQuota, error) {
	quota, err := ac.getBucketQuota(ctx, *bucket)
	if err != nil {
		return nil, err
	}
	return &models.BucketQuota{
		Quota: int64(quota.Quota),
		Type:  string(quota.Type),
	}, nil
}
