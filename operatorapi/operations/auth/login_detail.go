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
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	"github.com/go-openapi/runtime/middleware"
)

// LoginDetailHandlerFunc turns a function with the right signature into a login detail handler
type LoginDetailHandlerFunc func(LoginDetailParams) middleware.Responder

// Handle executing the request and returning a response
func (fn LoginDetailHandlerFunc) Handle(params LoginDetailParams) middleware.Responder {
	return fn(params)
}

// LoginDetailHandler interface for that can handle valid login detail params
type LoginDetailHandler interface {
	Handle(LoginDetailParams) middleware.Responder
}

// NewLoginDetail creates a new http.Handler for the login detail operation
func NewLoginDetail(ctx *middleware.Context, handler LoginDetailHandler) *LoginDetail {
	return &LoginDetail{Context: ctx, Handler: handler}
}

/* LoginDetail swagger:route GET /login Auth loginDetail

Returns login strategy, form or sso.

*/
type LoginDetail struct {
	Context *middleware.Context
	Handler LoginDetailHandler
}

func (o *LoginDetail) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		*r = *rCtx
	}
	var Params = NewLoginDetailParams()
	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request
	o.Context.Respond(rw, r, route.Produces, route, res)

}
