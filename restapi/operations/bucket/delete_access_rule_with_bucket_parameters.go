// Code generated by go-swagger; DO NOT EDIT.

// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 GuinsooLab, Inc.
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
//

package bucket

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"io"
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/validate"

	"github.com/minio/console/models"
)

// NewDeleteAccessRuleWithBucketParams creates a new DeleteAccessRuleWithBucketParams object
//
// There are no default values defined in the spec.
func NewDeleteAccessRuleWithBucketParams() DeleteAccessRuleWithBucketParams {

	return DeleteAccessRuleWithBucketParams{}
}

// DeleteAccessRuleWithBucketParams contains all the bound params for the delete access rule with bucket operation
// typically these are obtained from a http.Request
//
// swagger:parameters DeleteAccessRuleWithBucket
type DeleteAccessRuleWithBucketParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*
	  Required: true
	  In: path
	*/
	Bucket string
	/*
	  Required: true
	  In: body
	*/
	Prefix *models.PrefixWrapper
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewDeleteAccessRuleWithBucketParams() beforehand.
func (o *DeleteAccessRuleWithBucketParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	rBucket, rhkBucket, _ := route.Params.GetOK("bucket")
	if err := o.bindBucket(rBucket, rhkBucket, route.Formats); err != nil {
		res = append(res, err)
	}

	if runtime.HasBody(r) {
		defer r.Body.Close()
		var body models.PrefixWrapper
		if err := route.Consumer.Consume(r.Body, &body); err != nil {
			if err == io.EOF {
				res = append(res, errors.Required("prefix", "body", ""))
			} else {
				res = append(res, errors.NewParseError("prefix", "body", "", err))
			}
		} else {
			// validate body object
			if err := body.Validate(route.Formats); err != nil {
				res = append(res, err)
			}

			ctx := validate.WithOperationRequest(context.Background())
			if err := body.ContextValidate(ctx, route.Formats); err != nil {
				res = append(res, err)
			}

			if len(res) == 0 {
				o.Prefix = &body
			}
		}
	} else {
		res = append(res, errors.Required("prefix", "body", ""))
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindBucket binds and validates parameter Bucket from path.
func (o *DeleteAccessRuleWithBucketParams) bindBucket(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// Parameter is provided by construction from the route
	o.Bucket = raw

	return nil
}
