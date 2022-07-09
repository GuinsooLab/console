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

package group

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/minio/console/models"
)

// GroupInfoOKCode is the HTTP code returned for type GroupInfoOK
const GroupInfoOKCode int = 200

/*GroupInfoOK A successful response.

swagger:response groupInfoOK
*/
type GroupInfoOK struct {

	/*
	  In: Body
	*/
	Payload *models.Group `json:"body,omitempty"`
}

// NewGroupInfoOK creates GroupInfoOK with default headers values
func NewGroupInfoOK() *GroupInfoOK {

	return &GroupInfoOK{}
}

// WithPayload adds the payload to the group info o k response
func (o *GroupInfoOK) WithPayload(payload *models.Group) *GroupInfoOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the group info o k response
func (o *GroupInfoOK) SetPayload(payload *models.Group) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GroupInfoOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*GroupInfoDefault Generic error response.

swagger:response groupInfoDefault
*/
type GroupInfoDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewGroupInfoDefault creates GroupInfoDefault with default headers values
func NewGroupInfoDefault(code int) *GroupInfoDefault {
	if code <= 0 {
		code = 500
	}

	return &GroupInfoDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the group info default response
func (o *GroupInfoDefault) WithStatusCode(code int) *GroupInfoDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the group info default response
func (o *GroupInfoDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the group info default response
func (o *GroupInfoDefault) WithPayload(payload *models.Error) *GroupInfoDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the group info default response
func (o *GroupInfoDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GroupInfoDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
