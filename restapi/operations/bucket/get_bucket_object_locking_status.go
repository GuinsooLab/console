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

// GetBucketObjectLockingStatusHandlerFunc turns a function with the right signature into a get bucket object locking status handler
type GetBucketObjectLockingStatusHandlerFunc func(GetBucketObjectLockingStatusParams, *models.Principal) middleware.Responder

// Handle executing the request and returning a response
func (fn GetBucketObjectLockingStatusHandlerFunc) Handle(params GetBucketObjectLockingStatusParams, principal *models.Principal) middleware.Responder {
	return fn(params, principal)
}

// GetBucketObjectLockingStatusHandler interface for that can handle valid get bucket object locking status params
type GetBucketObjectLockingStatusHandler interface {
	Handle(GetBucketObjectLockingStatusParams, *models.Principal) middleware.Responder
}

// NewGetBucketObjectLockingStatus creates a new http.Handler for the get bucket object locking status operation
func NewGetBucketObjectLockingStatus(ctx *middleware.Context, handler GetBucketObjectLockingStatusHandler) *GetBucketObjectLockingStatus {
	return &GetBucketObjectLockingStatus{Context: ctx, Handler: handler}
}

/* GetBucketObjectLockingStatus swagger:route GET /buckets/{bucket_name}/object-locking Bucket getBucketObjectLockingStatus

Returns the status of object locking support on the bucket

*/
type GetBucketObjectLockingStatus struct {
	Context *middleware.Context
	Handler GetBucketObjectLockingStatusHandler
}

func (o *GetBucketObjectLockingStatus) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewGetBucketObjectLockingStatusParams()
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
