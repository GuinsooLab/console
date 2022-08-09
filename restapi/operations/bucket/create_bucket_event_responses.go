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

package bucket

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/GuinsooLab/console/models"
)

// CreateBucketEventCreatedCode is the HTTP code returned for type CreateBucketEventCreated
const CreateBucketEventCreatedCode int = 201

/*CreateBucketEventCreated A successful response.

swagger:response createBucketEventCreated
*/
type CreateBucketEventCreated struct {
}

// NewCreateBucketEventCreated creates CreateBucketEventCreated with default headers values
func NewCreateBucketEventCreated() *CreateBucketEventCreated {

	return &CreateBucketEventCreated{}
}

// WriteResponse to the client
func (o *CreateBucketEventCreated) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.Header().Del(runtime.HeaderContentType) //Remove Content-Type on empty responses

	rw.WriteHeader(201)
}

/*CreateBucketEventDefault Generic error response.

swagger:response createBucketEventDefault
*/
type CreateBucketEventDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewCreateBucketEventDefault creates CreateBucketEventDefault with default headers values
func NewCreateBucketEventDefault(code int) *CreateBucketEventDefault {
	if code <= 0 {
		code = 500
	}

	return &CreateBucketEventDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the create bucket event default response
func (o *CreateBucketEventDefault) WithStatusCode(code int) *CreateBucketEventDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the create bucket event default response
func (o *CreateBucketEventDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the create bucket event default response
func (o *CreateBucketEventDefault) WithPayload(payload *models.Error) *CreateBucketEventDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the create bucket event default response
func (o *CreateBucketEventDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *CreateBucketEventDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
