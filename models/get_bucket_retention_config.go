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
)

// GetBucketRetentionConfig get bucket retention config
//
// swagger:model getBucketRetentionConfig
type GetBucketRetentionConfig struct {

	// mode
	Mode ObjectRetentionMode `json:"mode,omitempty"`

	// unit
	Unit ObjectRetentionUnit `json:"unit,omitempty"`

	// validity
	Validity int32 `json:"validity,omitempty"`
}

// Validate validates this get bucket retention config
func (m *GetBucketRetentionConfig) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateMode(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateUnit(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GetBucketRetentionConfig) validateMode(formats strfmt.Registry) error {
	if swag.IsZero(m.Mode) { // not required
		return nil
	}

	if err := m.Mode.Validate(formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("mode")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("mode")
		}
		return err
	}

	return nil
}

func (m *GetBucketRetentionConfig) validateUnit(formats strfmt.Registry) error {
	if swag.IsZero(m.Unit) { // not required
		return nil
	}

	if err := m.Unit.Validate(formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("unit")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("unit")
		}
		return err
	}

	return nil
}

// ContextValidate validate this get bucket retention config based on the context it is used
func (m *GetBucketRetentionConfig) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateMode(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateUnit(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GetBucketRetentionConfig) contextValidateMode(ctx context.Context, formats strfmt.Registry) error {

	if err := m.Mode.ContextValidate(ctx, formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("mode")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("mode")
		}
		return err
	}

	return nil
}

func (m *GetBucketRetentionConfig) contextValidateUnit(ctx context.Context, formats strfmt.Registry) error {

	if err := m.Unit.ContextValidate(ctx, formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("unit")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("unit")
		}
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *GetBucketRetentionConfig) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *GetBucketRetentionConfig) UnmarshalBinary(b []byte) error {
	var res GetBucketRetentionConfig
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
