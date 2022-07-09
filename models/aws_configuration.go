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

// AwsConfiguration aws configuration
//
// swagger:model awsConfiguration
type AwsConfiguration struct {

	// secretsmanager
	// Required: true
	Secretsmanager *AwsConfigurationSecretsmanager `json:"secretsmanager"`
}

// Validate validates this aws configuration
func (m *AwsConfiguration) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateSecretsmanager(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AwsConfiguration) validateSecretsmanager(formats strfmt.Registry) error {

	if err := validate.Required("secretsmanager", "body", m.Secretsmanager); err != nil {
		return err
	}

	if m.Secretsmanager != nil {
		if err := m.Secretsmanager.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("secretsmanager")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("secretsmanager")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this aws configuration based on the context it is used
func (m *AwsConfiguration) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateSecretsmanager(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AwsConfiguration) contextValidateSecretsmanager(ctx context.Context, formats strfmt.Registry) error {

	if m.Secretsmanager != nil {
		if err := m.Secretsmanager.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("secretsmanager")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("secretsmanager")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *AwsConfiguration) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *AwsConfiguration) UnmarshalBinary(b []byte) error {
	var res AwsConfiguration
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// AwsConfigurationSecretsmanager aws configuration secretsmanager
//
// swagger:model AwsConfigurationSecretsmanager
type AwsConfigurationSecretsmanager struct {

	// credentials
	// Required: true
	Credentials *AwsConfigurationSecretsmanagerCredentials `json:"credentials"`

	// endpoint
	// Required: true
	Endpoint *string `json:"endpoint"`

	// kmskey
	Kmskey string `json:"kmskey,omitempty"`

	// region
	// Required: true
	Region *string `json:"region"`
}

// Validate validates this aws configuration secretsmanager
func (m *AwsConfigurationSecretsmanager) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCredentials(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateEndpoint(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateRegion(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AwsConfigurationSecretsmanager) validateCredentials(formats strfmt.Registry) error {

	if err := validate.Required("secretsmanager"+"."+"credentials", "body", m.Credentials); err != nil {
		return err
	}

	if m.Credentials != nil {
		if err := m.Credentials.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("secretsmanager" + "." + "credentials")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("secretsmanager" + "." + "credentials")
			}
			return err
		}
	}

	return nil
}

func (m *AwsConfigurationSecretsmanager) validateEndpoint(formats strfmt.Registry) error {

	if err := validate.Required("secretsmanager"+"."+"endpoint", "body", m.Endpoint); err != nil {
		return err
	}

	return nil
}

func (m *AwsConfigurationSecretsmanager) validateRegion(formats strfmt.Registry) error {

	if err := validate.Required("secretsmanager"+"."+"region", "body", m.Region); err != nil {
		return err
	}

	return nil
}

// ContextValidate validate this aws configuration secretsmanager based on the context it is used
func (m *AwsConfigurationSecretsmanager) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateCredentials(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AwsConfigurationSecretsmanager) contextValidateCredentials(ctx context.Context, formats strfmt.Registry) error {

	if m.Credentials != nil {
		if err := m.Credentials.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("secretsmanager" + "." + "credentials")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("secretsmanager" + "." + "credentials")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *AwsConfigurationSecretsmanager) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *AwsConfigurationSecretsmanager) UnmarshalBinary(b []byte) error {
	var res AwsConfigurationSecretsmanager
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// AwsConfigurationSecretsmanagerCredentials aws configuration secretsmanager credentials
//
// swagger:model AwsConfigurationSecretsmanagerCredentials
type AwsConfigurationSecretsmanagerCredentials struct {

	// accesskey
	// Required: true
	Accesskey *string `json:"accesskey"`

	// secretkey
	// Required: true
	Secretkey *string `json:"secretkey"`

	// token
	Token string `json:"token,omitempty"`
}

// Validate validates this aws configuration secretsmanager credentials
func (m *AwsConfigurationSecretsmanagerCredentials) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateAccesskey(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSecretkey(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *AwsConfigurationSecretsmanagerCredentials) validateAccesskey(formats strfmt.Registry) error {

	if err := validate.Required("secretsmanager"+"."+"credentials"+"."+"accesskey", "body", m.Accesskey); err != nil {
		return err
	}

	return nil
}

func (m *AwsConfigurationSecretsmanagerCredentials) validateSecretkey(formats strfmt.Registry) error {

	if err := validate.Required("secretsmanager"+"."+"credentials"+"."+"secretkey", "body", m.Secretkey); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this aws configuration secretsmanager credentials based on context it is used
func (m *AwsConfigurationSecretsmanagerCredentials) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *AwsConfigurationSecretsmanagerCredentials) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *AwsConfigurationSecretsmanagerCredentials) UnmarshalBinary(b []byte) error {
	var res AwsConfigurationSecretsmanagerCredentials
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
