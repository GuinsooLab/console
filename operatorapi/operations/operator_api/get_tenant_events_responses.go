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

// GetTenantEventsOKCode is the HTTP code returned for type GetTenantEventsOK
const GetTenantEventsOKCode int = 200

/*GetTenantEventsOK A successful response.

swagger:response getTenantEventsOK
*/
type GetTenantEventsOK struct {

	/*
	  In: Body
	*/
	Payload models.EventListWrapper `json:"body,omitempty"`
}

// NewGetTenantEventsOK creates GetTenantEventsOK with default headers values
func NewGetTenantEventsOK() *GetTenantEventsOK {

	return &GetTenantEventsOK{}
}

// WithPayload adds the payload to the get tenant events o k response
func (o *GetTenantEventsOK) WithPayload(payload models.EventListWrapper) *GetTenantEventsOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get tenant events o k response
func (o *GetTenantEventsOK) SetPayload(payload models.EventListWrapper) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetTenantEventsOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	payload := o.Payload
	if payload == nil {
		// return empty array
		payload = models.EventListWrapper{}
	}

	if err := producer.Produce(rw, payload); err != nil {
		panic(err) // let the recovery middleware deal with this
	}
}

/*GetTenantEventsDefault Generic error response.

swagger:response getTenantEventsDefault
*/
type GetTenantEventsDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewGetTenantEventsDefault creates GetTenantEventsDefault with default headers values
func NewGetTenantEventsDefault(code int) *GetTenantEventsDefault {
	if code <= 0 {
		code = 500
	}

	return &GetTenantEventsDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the get tenant events default response
func (o *GetTenantEventsDefault) WithStatusCode(code int) *GetTenantEventsDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the get tenant events default response
func (o *GetTenantEventsDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the get tenant events default response
func (o *GetTenantEventsDefault) WithPayload(payload *models.Error) *GetTenantEventsDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get tenant events default response
func (o *GetTenantEventsDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetTenantEventsDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
