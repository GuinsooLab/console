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

// ChangeUserPasswordRequest change user password request
//
// swagger:model changeUserPasswordRequest
type ChangeUserPasswordRequest struct {

	// new secret key
	// Required: true
	NewSecretKey *string `json:"newSecretKey"`

	// selected user
	// Required: true
	SelectedUser *string `json:"selectedUser"`
}

// Validate validates this change user password request
func (m *ChangeUserPasswordRequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateNewSecretKey(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSelectedUser(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ChangeUserPasswordRequest) validateNewSecretKey(formats strfmt.Registry) error {

	if err := validate.Required("newSecretKey", "body", m.NewSecretKey); err != nil {
		return err
	}

	return nil
}

func (m *ChangeUserPasswordRequest) validateSelectedUser(formats strfmt.Registry) error {

	if err := validate.Required("selectedUser", "body", m.SelectedUser); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this change user password request based on context it is used
func (m *ChangeUserPasswordRequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *ChangeUserPasswordRequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *ChangeUserPasswordRequest) UnmarshalBinary(b []byte) error {
	var res ChangeUserPasswordRequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
