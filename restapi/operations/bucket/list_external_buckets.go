// Code generated by go-swagger; DO NOT EDIT.

// This file is part of MinIO Console Server
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

package bucket

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	"github.com/go-openapi/runtime/middleware"

	"github.com/minio/console/models"
)

// ListExternalBucketsHandlerFunc turns a function with the right signature into a list external buckets handler
type ListExternalBucketsHandlerFunc func(ListExternalBucketsParams, *models.Principal) middleware.Responder

// Handle executing the request and returning a response
func (fn ListExternalBucketsHandlerFunc) Handle(params ListExternalBucketsParams, principal *models.Principal) middleware.Responder {
	return fn(params, principal)
}

// ListExternalBucketsHandler interface for that can handle valid list external buckets params
type ListExternalBucketsHandler interface {
	Handle(ListExternalBucketsParams, *models.Principal) middleware.Responder
}

// NewListExternalBuckets creates a new http.Handler for the list external buckets operation
func NewListExternalBuckets(ctx *middleware.Context, handler ListExternalBucketsHandler) *ListExternalBuckets {
	return &ListExternalBuckets{Context: ctx, Handler: handler}
}

/* ListExternalBuckets swagger:route POST /list-external-buckets Bucket listExternalBuckets

Lists an External list of buckets using custom credentials

*/
type ListExternalBuckets struct {
	Context *middleware.Context
	Handler ListExternalBucketsHandler
}

func (o *ListExternalBuckets) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewListExternalBucketsParams()
	uprinc, aCtx, err := o.Context.Authorize(r, route)
	if err != nil {
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}
	if aCtx != nil {
		*r = *aCtx
	}
	var principal *models.Principal
	if uprinc != nil {
		principal = uprinc.(*models.Principal) // this is really a models.Principal, I promise
	}

	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params, principal) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}
