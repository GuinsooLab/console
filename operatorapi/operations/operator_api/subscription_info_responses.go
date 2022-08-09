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

	"github.com/GuinsooLab/console/models"
)

// SubscriptionInfoOKCode is the HTTP code returned for type SubscriptionInfoOK
const SubscriptionInfoOKCode int = 200

/*SubscriptionInfoOK A successful response.

swagger:response subscriptionInfoOK
*/
type SubscriptionInfoOK struct {

	/*
	  In: Body
	*/
	Payload *models.License `json:"body,omitempty"`
}

// NewSubscriptionInfoOK creates SubscriptionInfoOK with default headers values
func NewSubscriptionInfoOK() *SubscriptionInfoOK {

	return &SubscriptionInfoOK{}
}

// WithPayload adds the payload to the subscription info o k response
func (o *SubscriptionInfoOK) WithPayload(payload *models.License) *SubscriptionInfoOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the subscription info o k response
func (o *SubscriptionInfoOK) SetPayload(payload *models.License) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SubscriptionInfoOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*SubscriptionInfoDefault Generic error response.

swagger:response subscriptionInfoDefault
*/
type SubscriptionInfoDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewSubscriptionInfoDefault creates SubscriptionInfoDefault with default headers values
func NewSubscriptionInfoDefault(code int) *SubscriptionInfoDefault {
	if code <= 0 {
		code = 500
	}

	return &SubscriptionInfoDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the subscription info default response
func (o *SubscriptionInfoDefault) WithStatusCode(code int) *SubscriptionInfoDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the subscription info default response
func (o *SubscriptionInfoDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the subscription info default response
func (o *SubscriptionInfoDefault) WithPayload(payload *models.Error) *SubscriptionInfoDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the subscription info default response
func (o *SubscriptionInfoDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SubscriptionInfoDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
