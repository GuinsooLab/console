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

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// PutObjectRestoreOKCode is the HTTP code returned for type PutObjectRestoreOK
const PutObjectRestoreOKCode int = 200

/*PutObjectRestoreOK A successful response.

swagger:response putObjectRestoreOK
*/
type PutObjectRestoreOK struct {
}

// NewPutObjectRestoreOK creates PutObjectRestoreOK with default headers values
func NewPutObjectRestoreOK() *PutObjectRestoreOK {

	return &PutObjectRestoreOK{}
}

// WriteResponse to the client
func (o *PutObjectRestoreOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.Header().Del(runtime.HeaderContentType) //Remove Content-Type on empty responses

	rw.WriteHeader(200)
}

/*PutObjectRestoreDefault Generic error response.

swagger:response putObjectRestoreDefault
*/
type PutObjectRestoreDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewPutObjectRestoreDefault creates PutObjectRestoreDefault with default headers values
func NewPutObjectRestoreDefault(code int) *PutObjectRestoreDefault {
	if code <= 0 {
		code = 500
	}

	return &PutObjectRestoreDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the put object restore default response
func (o *PutObjectRestoreDefault) WithStatusCode(code int) *PutObjectRestoreDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the put object restore default response
func (o *PutObjectRestoreDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the put object restore default response
func (o *PutObjectRestoreDefault) WithPayload(payload *models.Error) *PutObjectRestoreDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the put object restore default response
func (o *PutObjectRestoreDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PutObjectRestoreDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
