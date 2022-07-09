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

package operator_api

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// TenantSecurityOKCode is the HTTP code returned for type TenantSecurityOK
const TenantSecurityOKCode int = 200

/*TenantSecurityOK A successful response.

swagger:response tenantSecurityOK
*/
type TenantSecurityOK struct {

	/*
	  In: Body
	*/
	Payload *models.TenantSecurityResponse `json:"body,omitempty"`
}

// NewTenantSecurityOK creates TenantSecurityOK with default headers values
func NewTenantSecurityOK() *TenantSecurityOK {

	return &TenantSecurityOK{}
}

// WithPayload adds the payload to the tenant security o k response
func (o *TenantSecurityOK) WithPayload(payload *models.TenantSecurityResponse) *TenantSecurityOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the tenant security o k response
func (o *TenantSecurityOK) SetPayload(payload *models.TenantSecurityResponse) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *TenantSecurityOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*TenantSecurityDefault Generic error response.

swagger:response tenantSecurityDefault
*/
type TenantSecurityDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewTenantSecurityDefault creates TenantSecurityDefault with default headers values
func NewTenantSecurityDefault(code int) *TenantSecurityDefault {
	if code <= 0 {
		code = 500
	}

	return &TenantSecurityDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the tenant security default response
func (o *TenantSecurityDefault) WithStatusCode(code int) *TenantSecurityDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the tenant security default response
func (o *TenantSecurityDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the tenant security default response
func (o *TenantSecurityDefault) WithPayload(payload *models.Error) *TenantSecurityDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the tenant security default response
func (o *TenantSecurityDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *TenantSecurityDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
