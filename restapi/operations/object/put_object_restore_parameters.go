// Code generated by go-swagger; DO NOT EDIT.

// This file is part of GuinsooLab Console Server
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

package object

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/validate"
)

// NewPutObjectRestoreParams creates a new PutObjectRestoreParams object
//
// There are no default values defined in the spec.
func NewPutObjectRestoreParams() PutObjectRestoreParams {

	return PutObjectRestoreParams{}
}

// PutObjectRestoreParams contains all the bound params for the put object restore operation
// typically these are obtained from a http.Request
//
// swagger:parameters PutObjectRestore
type PutObjectRestoreParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*
	  Required: true
	  In: path
	*/
	BucketName string
	/*
	  Required: true
	  In: query
	*/
	Prefix string
	/*
	  Required: true
	  In: query
	*/
	VersionID string
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewPutObjectRestoreParams() beforehand.
func (o *PutObjectRestoreParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	qs := runtime.Values(r.URL.Query())

	rBucketName, rhkBucketName, _ := route.Params.GetOK("bucket_name")
	if err := o.bindBucketName(rBucketName, rhkBucketName, route.Formats); err != nil {
		res = append(res, err)
	}

	qPrefix, qhkPrefix, _ := qs.GetOK("prefix")
	if err := o.bindPrefix(qPrefix, qhkPrefix, route.Formats); err != nil {
		res = append(res, err)
	}

	qVersionID, qhkVersionID, _ := qs.GetOK("version_id")
	if err := o.bindVersionID(qVersionID, qhkVersionID, route.Formats); err != nil {
		res = append(res, err)
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindBucketName binds and validates parameter BucketName from path.
func (o *PutObjectRestoreParams) bindBucketName(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// Parameter is provided by construction from the route
	o.BucketName = raw

	return nil
}

// bindPrefix binds and validates parameter Prefix from query.
func (o *PutObjectRestoreParams) bindPrefix(rawData []string, hasKey bool, formats strfmt.Registry) error {
	if !hasKey {
		return errors.Required("prefix", "query", rawData)
	}
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// AllowEmptyValue: false

	if err := validate.RequiredString("prefix", "query", raw); err != nil {
		return err
	}
	o.Prefix = raw

	return nil
}

// bindVersionID binds and validates parameter VersionID from query.
func (o *PutObjectRestoreParams) bindVersionID(rawData []string, hasKey bool, formats strfmt.Registry) error {
	if !hasKey {
		return errors.Required("version_id", "query", rawData)
	}
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// AllowEmptyValue: false

	if err := validate.RequiredString("version_id", "query", raw); err != nil {
		return err
	}
	o.VersionID = raw

	return nil
}
