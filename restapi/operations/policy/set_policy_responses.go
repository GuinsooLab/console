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

package policy

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/GuinsooLab/console/models"
)

// SetPolicyNoContentCode is the HTTP code returned for type SetPolicyNoContent
const SetPolicyNoContentCode int = 204

/*SetPolicyNoContent A successful response.

swagger:response setPolicyNoContent
*/
type SetPolicyNoContent struct {
}

// NewSetPolicyNoContent creates SetPolicyNoContent with default headers values
func NewSetPolicyNoContent() *SetPolicyNoContent {

	return &SetPolicyNoContent{}
}

// WriteResponse to the client
func (o *SetPolicyNoContent) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.Header().Del(runtime.HeaderContentType) //Remove Content-Type on empty responses

	rw.WriteHeader(204)
}

/*SetPolicyDefault Generic error response.

swagger:response setPolicyDefault
*/
type SetPolicyDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewSetPolicyDefault creates SetPolicyDefault with default headers values
func NewSetPolicyDefault(code int) *SetPolicyDefault {
	if code <= 0 {
		code = 500
	}

	return &SetPolicyDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the set policy default response
func (o *SetPolicyDefault) WithStatusCode(code int) *SetPolicyDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the set policy default response
func (o *SetPolicyDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the set policy default response
func (o *SetPolicyDefault) WithPayload(payload *models.Error) *SetPolicyDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the set policy default response
func (o *SetPolicyDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SetPolicyDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
