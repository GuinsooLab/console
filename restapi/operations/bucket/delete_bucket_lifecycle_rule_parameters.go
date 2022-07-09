// Code generated by go-swagger; DO NOT EDIT.

// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
)

// NewDeleteBucketLifecycleRuleParams creates a new DeleteBucketLifecycleRuleParams object
//
// There are no default values defined in the spec.
func NewDeleteBucketLifecycleRuleParams() DeleteBucketLifecycleRuleParams {

	return DeleteBucketLifecycleRuleParams{}
}

// DeleteBucketLifecycleRuleParams contains all the bound params for the delete bucket lifecycle rule operation
// typically these are obtained from a http.Request
//
// swagger:parameters DeleteBucketLifecycleRule
type DeleteBucketLifecycleRuleParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*
	  Required: true
	  In: path
	*/
	BucketName string
	/*
	  Required: true
	  In: path
	*/
	LifecycleID string
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewDeleteBucketLifecycleRuleParams() beforehand.
func (o *DeleteBucketLifecycleRuleParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	rBucketName, rhkBucketName, _ := route.Params.GetOK("bucket_name")
	if err := o.bindBucketName(rBucketName, rhkBucketName, route.Formats); err != nil {
		res = append(res, err)
	}

	rLifecycleID, rhkLifecycleID, _ := route.Params.GetOK("lifecycle_id")
	if err := o.bindLifecycleID(rLifecycleID, rhkLifecycleID, route.Formats); err != nil {
		res = append(res, err)
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindBucketName binds and validates parameter BucketName from path.
func (o *DeleteBucketLifecycleRuleParams) bindBucketName(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// Parameter is provided by construction from the route
	o.BucketName = raw

	return nil
}

// bindLifecycleID binds and validates parameter LifecycleID from path.
func (o *DeleteBucketLifecycleRuleParams) bindLifecycleID(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// Parameter is provided by construction from the route
	o.LifecycleID = raw

	return nil
}
