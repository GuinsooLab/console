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

package bucket

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/GuinsooLab/console/models"
)

// DeleteBucketNoContentCode is the HTTP code returned for type DeleteBucketNoContent
const DeleteBucketNoContentCode int = 204

/*DeleteBucketNoContent A successful response.

swagger:response deleteBucketNoContent
*/
type DeleteBucketNoContent struct {
}

// NewDeleteBucketNoContent creates DeleteBucketNoContent with default headers values
func NewDeleteBucketNoContent() *DeleteBucketNoContent {

	return &DeleteBucketNoContent{}
}

// WriteResponse to the client
func (o *DeleteBucketNoContent) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.Header().Del(runtime.HeaderContentType) //Remove Content-Type on empty responses

	rw.WriteHeader(204)
}

/*DeleteBucketDefault Generic error response.

swagger:response deleteBucketDefault
*/
type DeleteBucketDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewDeleteBucketDefault creates DeleteBucketDefault with default headers values
func NewDeleteBucketDefault(code int) *DeleteBucketDefault {
	if code <= 0 {
		code = 500
	}

	return &DeleteBucketDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the delete bucket default response
func (o *DeleteBucketDefault) WithStatusCode(code int) *DeleteBucketDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the delete bucket default response
func (o *DeleteBucketDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the delete bucket default response
func (o *DeleteBucketDefault) WithPayload(payload *models.Error) *DeleteBucketDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the delete bucket default response
func (o *DeleteBucketDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *DeleteBucketDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
