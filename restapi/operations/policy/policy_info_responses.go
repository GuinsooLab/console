// Code generated by go-swagger; DO NOT EDIT.

// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 GuinsooLab.
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

package policy

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/GuinsooLab/console/models"
)

// PolicyInfoOKCode is the HTTP code returned for type PolicyInfoOK
const PolicyInfoOKCode int = 200

/*PolicyInfoOK A successful response.

swagger:response policyInfoOK
*/
type PolicyInfoOK struct {

	/*
	  In: Body
	*/
	Payload *models.Policy `json:"body,omitempty"`
}

// NewPolicyInfoOK creates PolicyInfoOK with default headers values
func NewPolicyInfoOK() *PolicyInfoOK {

	return &PolicyInfoOK{}
}

// WithPayload adds the payload to the policy info o k response
func (o *PolicyInfoOK) WithPayload(payload *models.Policy) *PolicyInfoOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the policy info o k response
func (o *PolicyInfoOK) SetPayload(payload *models.Policy) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PolicyInfoOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*PolicyInfoDefault Generic error response.

swagger:response policyInfoDefault
*/
type PolicyInfoDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewPolicyInfoDefault creates PolicyInfoDefault with default headers values
func NewPolicyInfoDefault(code int) *PolicyInfoDefault {
	if code <= 0 {
		code = 500
	}

	return &PolicyInfoDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the policy info default response
func (o *PolicyInfoDefault) WithStatusCode(code int) *PolicyInfoDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the policy info default response
func (o *PolicyInfoDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the policy info default response
func (o *PolicyInfoDefault) WithPayload(payload *models.Error) *PolicyInfoDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the policy info default response
func (o *PolicyInfoDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PolicyInfoDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
