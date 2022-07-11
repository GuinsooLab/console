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

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// SubnetLoginMFARequest subnet login m f a request
//
// swagger:model subnetLoginMFARequest
type SubnetLoginMFARequest struct {

	// mfa token
	// Required: true
	MfaToken *string `json:"mfa_token"`

	// otp
	// Required: true
	Otp *string `json:"otp"`

	// username
	// Required: true
	Username *string `json:"username"`
}

// Validate validates this subnet login m f a request
func (m *SubnetLoginMFARequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateMfaToken(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateOtp(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateUsername(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *SubnetLoginMFARequest) validateMfaToken(formats strfmt.Registry) error {

	if err := validate.Required("mfa_token", "body", m.MfaToken); err != nil {
		return err
	}

	return nil
}

func (m *SubnetLoginMFARequest) validateOtp(formats strfmt.Registry) error {

	if err := validate.Required("otp", "body", m.Otp); err != nil {
		return err
	}

	return nil
}

func (m *SubnetLoginMFARequest) validateUsername(formats strfmt.Registry) error {

	if err := validate.Required("username", "body", m.Username); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this subnet login m f a request based on context it is used
func (m *SubnetLoginMFARequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *SubnetLoginMFARequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *SubnetLoginMFARequest) UnmarshalBinary(b []byte) error {
	var res SubnetLoginMFARequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
