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

package operator_api

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/GuinsooLab/console/models"
)

// DeletePodNoContentCode is the HTTP code returned for type DeletePodNoContent
const DeletePodNoContentCode int = 204

/*DeletePodNoContent A successful response.

swagger:response deletePodNoContent
*/
type DeletePodNoContent struct {
}

// NewDeletePodNoContent creates DeletePodNoContent with default headers values
func NewDeletePodNoContent() *DeletePodNoContent {

	return &DeletePodNoContent{}
}

// WriteResponse to the client
func (o *DeletePodNoContent) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.Header().Del(runtime.HeaderContentType) //Remove Content-Type on empty responses

	rw.WriteHeader(204)
}

/*DeletePodDefault Generic error response.

swagger:response deletePodDefault
*/
type DeletePodDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewDeletePodDefault creates DeletePodDefault with default headers values
func NewDeletePodDefault(code int) *DeletePodDefault {
	if code <= 0 {
		code = 500
	}

	return &DeletePodDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the delete pod default response
func (o *DeletePodDefault) WithStatusCode(code int) *DeletePodDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the delete pod default response
func (o *DeletePodDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the delete pod default response
func (o *DeletePodDefault) WithPayload(payload *models.Error) *DeletePodDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the delete pod default response
func (o *DeletePodDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *DeletePodDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
