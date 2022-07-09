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

// SubscriptionRefreshOKCode is the HTTP code returned for type SubscriptionRefreshOK
const SubscriptionRefreshOKCode int = 200

/*SubscriptionRefreshOK A successful response.

swagger:response subscriptionRefreshOK
*/
type SubscriptionRefreshOK struct {

	/*
	  In: Body
	*/
	Payload *models.License `json:"body,omitempty"`
}

// NewSubscriptionRefreshOK creates SubscriptionRefreshOK with default headers values
func NewSubscriptionRefreshOK() *SubscriptionRefreshOK {

	return &SubscriptionRefreshOK{}
}

// WithPayload adds the payload to the subscription refresh o k response
func (o *SubscriptionRefreshOK) WithPayload(payload *models.License) *SubscriptionRefreshOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the subscription refresh o k response
func (o *SubscriptionRefreshOK) SetPayload(payload *models.License) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SubscriptionRefreshOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*SubscriptionRefreshDefault Generic error response.

swagger:response subscriptionRefreshDefault
*/
type SubscriptionRefreshDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewSubscriptionRefreshDefault creates SubscriptionRefreshDefault with default headers values
func NewSubscriptionRefreshDefault(code int) *SubscriptionRefreshDefault {
	if code <= 0 {
		code = 500
	}

	return &SubscriptionRefreshDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the subscription refresh default response
func (o *SubscriptionRefreshDefault) WithStatusCode(code int) *SubscriptionRefreshDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the subscription refresh default response
func (o *SubscriptionRefreshDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the subscription refresh default response
func (o *SubscriptionRefreshDefault) WithPayload(payload *models.Error) *SubscriptionRefreshDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the subscription refresh default response
func (o *SubscriptionRefreshDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SubscriptionRefreshDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
