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

package operator_api

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"errors"
	"net/url"
	golangswaggerpaths "path"
	"strings"
)

// DeletePVCURL generates an URL for the delete p v c operation
type DeletePVCURL struct {
	PVCName   string
	Namespace string
	Tenant    string

	_basePath string
	// avoid unkeyed usage
	_ struct{}
}

// WithBasePath sets the base path for this url builder, only required when it's different from the
// base path specified in the swagger spec.
// When the value of the base path is an empty string
func (o *DeletePVCURL) WithBasePath(bp string) *DeletePVCURL {
	o.SetBasePath(bp)
	return o
}

// SetBasePath sets the base path for this url builder, only required when it's different from the
// base path specified in the swagger spec.
// When the value of the base path is an empty string
func (o *DeletePVCURL) SetBasePath(bp string) {
	o._basePath = bp
}

// Build a url path and query string
func (o *DeletePVCURL) Build() (*url.URL, error) {
	var _result url.URL

	var _path = "/namespaces/{namespace}/tenants/{tenant}/pvc/{PVCName}"

	pVCName := o.PVCName
	if pVCName != "" {
		_path = strings.Replace(_path, "{PVCName}", pVCName, -1)
	} else {
		return nil, errors.New("pVCName is required on DeletePVCURL")
	}

	namespace := o.Namespace
	if namespace != "" {
		_path = strings.Replace(_path, "{namespace}", namespace, -1)
	} else {
		return nil, errors.New("namespace is required on DeletePVCURL")
	}

	tenant := o.Tenant
	if tenant != "" {
		_path = strings.Replace(_path, "{tenant}", tenant, -1)
	} else {
		return nil, errors.New("tenant is required on DeletePVCURL")
	}

	_basePath := o._basePath
	if _basePath == "" {
		_basePath = "/api/v1"
	}
	_result.Path = golangswaggerpaths.Join(_basePath, _path)

	return &_result, nil
}

// Must is a helper function to panic when the url builder returns an error
func (o *DeletePVCURL) Must(u *url.URL, err error) *url.URL {
	if err != nil {
		panic(err)
	}
	if u == nil {
		panic("url can't be nil")
	}
	return u
}

// String returns the string representation of the path with query string
func (o *DeletePVCURL) String() string {
	return o.Must(o.Build()).String()
}

// BuildFull builds a full url with scheme, host, path and query string
func (o *DeletePVCURL) BuildFull(scheme, host string) (*url.URL, error) {
	if scheme == "" {
		return nil, errors.New("scheme is required for a full url on DeletePVCURL")
	}
	if host == "" {
		return nil, errors.New("host is required for a full url on DeletePVCURL")
	}

	base, err := o.Build()
	if err != nil {
		return nil, err
	}

	base.Scheme = scheme
	base.Host = host
	return base, nil
}

// StringFull returns the string representation of a complete url
func (o *DeletePVCURL) StringFull(scheme, host string) string {
	return o.Must(o.BuildFull(scheme, host)).String()
}