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

package inspect

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"io"
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// InspectOKCode is the HTTP code returned for type InspectOK
const InspectOKCode int = 200

/*InspectOK A successful response.

swagger:response inspectOK
*/
type InspectOK struct {

	/*
	  In: Body
	*/
	Payload io.ReadCloser `json:"body,omitempty"`
}

// NewInspectOK creates InspectOK with default headers values
func NewInspectOK() *InspectOK {

	return &InspectOK{}
}

// WithPayload adds the payload to the inspect o k response
func (o *InspectOK) WithPayload(payload io.ReadCloser) *InspectOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the inspect o k response
func (o *InspectOK) SetPayload(payload io.ReadCloser) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *InspectOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	payload := o.Payload
	if err := producer.Produce(rw, payload); err != nil {
		panic(err) // let the recovery middleware deal with this
	}
}

/*InspectDefault Generic error response.

swagger:response inspectDefault
*/
type InspectDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewInspectDefault creates InspectDefault with default headers values
func NewInspectDefault(code int) *InspectDefault {
	if code <= 0 {
		code = 500
	}

	return &InspectDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the inspect default response
func (o *InspectDefault) WithStatusCode(code int) *InspectDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the inspect default response
func (o *InspectDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the inspect default response
func (o *InspectDefault) WithPayload(payload *models.Error) *InspectDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the inspect default response
func (o *InspectDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *InspectDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
