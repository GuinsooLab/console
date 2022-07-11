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

package auth

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// SessionCheckOKCode is the HTTP code returned for type SessionCheckOK
const SessionCheckOKCode int = 200

/*SessionCheckOK A successful response.

swagger:response sessionCheckOK
*/
type SessionCheckOK struct {

	/*
	  In: Body
	*/
	Payload *models.SessionResponse `json:"body,omitempty"`
}

// NewSessionCheckOK creates SessionCheckOK with default headers values
func NewSessionCheckOK() *SessionCheckOK {

	return &SessionCheckOK{}
}

// WithPayload adds the payload to the session check o k response
func (o *SessionCheckOK) WithPayload(payload *models.SessionResponse) *SessionCheckOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the session check o k response
func (o *SessionCheckOK) SetPayload(payload *models.SessionResponse) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SessionCheckOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*SessionCheckDefault Generic error response.

swagger:response sessionCheckDefault
*/
type SessionCheckDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewSessionCheckDefault creates SessionCheckDefault with default headers values
func NewSessionCheckDefault(code int) *SessionCheckDefault {
	if code <= 0 {
		code = 500
	}

	return &SessionCheckDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the session check default response
func (o *SessionCheckDefault) WithStatusCode(code int) *SessionCheckDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the session check default response
func (o *SessionCheckDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the session check default response
func (o *SessionCheckDefault) WithPayload(payload *models.Error) *SessionCheckDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the session check default response
func (o *SessionCheckDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *SessionCheckDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
