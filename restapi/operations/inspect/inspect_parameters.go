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

package inspect

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// NewInspectParams creates a new InspectParams object
//
// There are no default values defined in the spec.
func NewInspectParams() InspectParams {

	return InspectParams{}
}

// InspectParams contains all the bound params for the inspect operation
// typically these are obtained from a http.Request
//
// swagger:parameters Inspect
type InspectParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*
	  In: query
	*/
	Encrypt *bool
	/*
	  Required: true
	  In: query
	*/
	File string
	/*
	  Required: true
	  In: query
	*/
	Volume string
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewInspectParams() beforehand.
func (o *InspectParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	qs := runtime.Values(r.URL.Query())

	qEncrypt, qhkEncrypt, _ := qs.GetOK("encrypt")
	if err := o.bindEncrypt(qEncrypt, qhkEncrypt, route.Formats); err != nil {
		res = append(res, err)
	}

	qFile, qhkFile, _ := qs.GetOK("file")
	if err := o.bindFile(qFile, qhkFile, route.Formats); err != nil {
		res = append(res, err)
	}

	qVolume, qhkVolume, _ := qs.GetOK("volume")
	if err := o.bindVolume(qVolume, qhkVolume, route.Formats); err != nil {
		res = append(res, err)
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindEncrypt binds and validates parameter Encrypt from query.
func (o *InspectParams) bindEncrypt(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: false
	// AllowEmptyValue: false

	if raw == "" { // empty values pass all other validations
		return nil
	}

	value, err := swag.ConvertBool(raw)
	if err != nil {
		return errors.InvalidType("encrypt", "query", "bool", raw)
	}
	o.Encrypt = &value

	return nil
}

// bindFile binds and validates parameter File from query.
func (o *InspectParams) bindFile(rawData []string, hasKey bool, formats strfmt.Registry) error {
	if !hasKey {
		return errors.Required("file", "query", rawData)
	}
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// AllowEmptyValue: false

	if err := validate.RequiredString("file", "query", raw); err != nil {
		return err
	}
	o.File = raw

	return nil
}

// bindVolume binds and validates parameter Volume from query.
func (o *InspectParams) bindVolume(rawData []string, hasKey bool, formats strfmt.Registry) error {
	if !hasKey {
		return errors.Required("volume", "query", rawData)
	}
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: true
	// AllowEmptyValue: false

	if err := validate.RequiredString("volume", "query", raw); err != nil {
		return err
	}
	o.Volume = raw

	return nil
}
