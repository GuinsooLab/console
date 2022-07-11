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

// ProjectedVolumeSource projected volume source
//
// swagger:model projectedVolumeSource
type ProjectedVolumeSource struct {

	// config map
	ConfigMap *ConfigMap `json:"configMap,omitempty"`

	// downward Api
	DownwardAPI bool `json:"downwardApi,omitempty"`

	// secret
	Secret *Secret `json:"secret,omitempty"`

	// service account token
	ServiceAccountToken *ServiceAccountToken `json:"serviceAccountToken,omitempty"`
}

// Validate validates this projected volume source
func (m *ProjectedVolumeSource) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateConfigMap(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSecret(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateServiceAccountToken(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ProjectedVolumeSource) validateConfigMap(formats strfmt.Registry) error {
	if swag.IsZero(m.ConfigMap) { // not required
		return nil
	}

	if m.ConfigMap != nil {
		if err := m.ConfigMap.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("configMap")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("configMap")
			}
			return err
		}
	}

	return nil
}

func (m *ProjectedVolumeSource) validateSecret(formats strfmt.Registry) error {
	if swag.IsZero(m.Secret) { // not required
		return nil
	}

	if m.Secret != nil {
		if err := m.Secret.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("secret")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("secret")
			}
			return err
		}
	}

	return nil
}

func (m *ProjectedVolumeSource) validateServiceAccountToken(formats strfmt.Registry) error {
	if swag.IsZero(m.ServiceAccountToken) { // not required
		return nil
	}

	if m.ServiceAccountToken != nil {
		if err := m.ServiceAccountToken.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("serviceAccountToken")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("serviceAccountToken")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this projected volume source based on the context it is used
func (m *ProjectedVolumeSource) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateConfigMap(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateSecret(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateServiceAccountToken(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *ProjectedVolumeSource) contextValidateConfigMap(ctx context.Context, formats strfmt.Registry) error {

	if m.ConfigMap != nil {
		if err := m.ConfigMap.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("configMap")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("configMap")
			}
			return err
		}
	}

	return nil
}

func (m *ProjectedVolumeSource) contextValidateSecret(ctx context.Context, formats strfmt.Registry) error {

	if m.Secret != nil {
		if err := m.Secret.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("secret")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("secret")
			}
			return err
		}
	}

	return nil
}

func (m *ProjectedVolumeSource) contextValidateServiceAccountToken(ctx context.Context, formats strfmt.Registry) error {

	if m.ServiceAccountToken != nil {
		if err := m.ServiceAccountToken.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("serviceAccountToken")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("serviceAccountToken")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *ProjectedVolumeSource) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *ProjectedVolumeSource) UnmarshalBinary(b []byte) error {
	var res ProjectedVolumeSource
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
