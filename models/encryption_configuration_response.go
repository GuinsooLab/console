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
)

// EncryptionConfigurationResponse encryption configuration response
//
// swagger:model encryptionConfigurationResponse
type EncryptionConfigurationResponse struct {
	MetadataFields

	// aws
	Aws *AwsConfiguration `json:"aws,omitempty"`

	// azure
	Azure *AzureConfiguration `json:"azure,omitempty"`

	// gcp
	Gcp *GcpConfiguration `json:"gcp,omitempty"`

	// gemalto
	Gemalto *GemaltoConfigurationResponse `json:"gemalto,omitempty"`

	// image
	Image string `json:"image,omitempty"`

	// mtls client
	MtlsClient *CertificateInfo `json:"mtls_client,omitempty"`

	// replicas
	Replicas string `json:"replicas,omitempty"`

	// security context
	SecurityContext *SecurityContext `json:"securityContext,omitempty"`

	// server
	Server *CertificateInfo `json:"server,omitempty"`

	// vault
	Vault *VaultConfigurationResponse `json:"vault,omitempty"`
}

// UnmarshalJSON unmarshals this object from a JSON structure
func (m *EncryptionConfigurationResponse) UnmarshalJSON(raw []byte) error {
	// AO0
	var aO0 MetadataFields
	if err := swag.ReadJSON(raw, &aO0); err != nil {
		return err
	}
	m.MetadataFields = aO0

	// AO1
	var dataAO1 struct {
		Aws *AwsConfiguration `json:"aws,omitempty"`

		Azure *AzureConfiguration `json:"azure,omitempty"`

		Gcp *GcpConfiguration `json:"gcp,omitempty"`

		Gemalto *GemaltoConfigurationResponse `json:"gemalto,omitempty"`

		Image string `json:"image,omitempty"`

		MtlsClient *CertificateInfo `json:"mtls_client,omitempty"`

		Replicas string `json:"replicas,omitempty"`

		SecurityContext *SecurityContext `json:"securityContext,omitempty"`

		Server *CertificateInfo `json:"server,omitempty"`

		Vault *VaultConfigurationResponse `json:"vault,omitempty"`
	}
	if err := swag.ReadJSON(raw, &dataAO1); err != nil {
		return err
	}

	m.Aws = dataAO1.Aws

	m.Azure = dataAO1.Azure

	m.Gcp = dataAO1.Gcp

	m.Gemalto = dataAO1.Gemalto

	m.Image = dataAO1.Image

	m.MtlsClient = dataAO1.MtlsClient

	m.Replicas = dataAO1.Replicas

	m.SecurityContext = dataAO1.SecurityContext

	m.Server = dataAO1.Server

	m.Vault = dataAO1.Vault

	return nil
}

// MarshalJSON marshals this object to a JSON structure
func (m EncryptionConfigurationResponse) MarshalJSON() ([]byte, error) {
	_parts := make([][]byte, 0, 2)

	aO0, err := swag.WriteJSON(m.MetadataFields)
	if err != nil {
		return nil, err
	}
	_parts = append(_parts, aO0)
	var dataAO1 struct {
		Aws *AwsConfiguration `json:"aws,omitempty"`

		Azure *AzureConfiguration `json:"azure,omitempty"`

		Gcp *GcpConfiguration `json:"gcp,omitempty"`

		Gemalto *GemaltoConfigurationResponse `json:"gemalto,omitempty"`

		Image string `json:"image,omitempty"`

		MtlsClient *CertificateInfo `json:"mtls_client,omitempty"`

		Replicas string `json:"replicas,omitempty"`

		SecurityContext *SecurityContext `json:"securityContext,omitempty"`

		Server *CertificateInfo `json:"server,omitempty"`

		Vault *VaultConfigurationResponse `json:"vault,omitempty"`
	}

	dataAO1.Aws = m.Aws

	dataAO1.Azure = m.Azure

	dataAO1.Gcp = m.Gcp

	dataAO1.Gemalto = m.Gemalto

	dataAO1.Image = m.Image

	dataAO1.MtlsClient = m.MtlsClient

	dataAO1.Replicas = m.Replicas

	dataAO1.SecurityContext = m.SecurityContext

	dataAO1.Server = m.Server

	dataAO1.Vault = m.Vault

	jsonDataAO1, errAO1 := swag.WriteJSON(dataAO1)
	if errAO1 != nil {
		return nil, errAO1
	}
	_parts = append(_parts, jsonDataAO1)
	return swag.ConcatJSON(_parts...), nil
}

// Validate validates this encryption configuration response
func (m *EncryptionConfigurationResponse) Validate(formats strfmt.Registry) error {
	var res []error

	// validation for a type composition with MetadataFields
	if err := m.MetadataFields.Validate(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateAws(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateAzure(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateGcp(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateGemalto(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateMtlsClient(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSecurityContext(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateServer(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateVault(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *EncryptionConfigurationResponse) validateAws(formats strfmt.Registry) error {

	if swag.IsZero(m.Aws) { // not required
		return nil
	}

	if m.Aws != nil {
		if err := m.Aws.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("aws")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("aws")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateAzure(formats strfmt.Registry) error {

	if swag.IsZero(m.Azure) { // not required
		return nil
	}

	if m.Azure != nil {
		if err := m.Azure.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("azure")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("azure")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateGcp(formats strfmt.Registry) error {

	if swag.IsZero(m.Gcp) { // not required
		return nil
	}

	if m.Gcp != nil {
		if err := m.Gcp.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gcp")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gcp")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateGemalto(formats strfmt.Registry) error {

	if swag.IsZero(m.Gemalto) { // not required
		return nil
	}

	if m.Gemalto != nil {
		if err := m.Gemalto.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gemalto")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gemalto")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateMtlsClient(formats strfmt.Registry) error {

	if swag.IsZero(m.MtlsClient) { // not required
		return nil
	}

	if m.MtlsClient != nil {
		if err := m.MtlsClient.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("mtls_client")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("mtls_client")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateSecurityContext(formats strfmt.Registry) error {

	if swag.IsZero(m.SecurityContext) { // not required
		return nil
	}

	if m.SecurityContext != nil {
		if err := m.SecurityContext.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("securityContext")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("securityContext")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateServer(formats strfmt.Registry) error {

	if swag.IsZero(m.Server) { // not required
		return nil
	}

	if m.Server != nil {
		if err := m.Server.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("server")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("server")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) validateVault(formats strfmt.Registry) error {

	if swag.IsZero(m.Vault) { // not required
		return nil
	}

	if m.Vault != nil {
		if err := m.Vault.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("vault")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("vault")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this encryption configuration response based on the context it is used
func (m *EncryptionConfigurationResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	// validation for a type composition with MetadataFields
	if err := m.MetadataFields.ContextValidate(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateAws(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateAzure(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateGcp(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateGemalto(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateMtlsClient(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateSecurityContext(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateServer(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateVault(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateAws(ctx context.Context, formats strfmt.Registry) error {

	if m.Aws != nil {
		if err := m.Aws.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("aws")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("aws")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateAzure(ctx context.Context, formats strfmt.Registry) error {

	if m.Azure != nil {
		if err := m.Azure.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("azure")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("azure")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateGcp(ctx context.Context, formats strfmt.Registry) error {

	if m.Gcp != nil {
		if err := m.Gcp.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gcp")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gcp")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateGemalto(ctx context.Context, formats strfmt.Registry) error {

	if m.Gemalto != nil {
		if err := m.Gemalto.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("gemalto")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("gemalto")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateMtlsClient(ctx context.Context, formats strfmt.Registry) error {

	if m.MtlsClient != nil {
		if err := m.MtlsClient.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("mtls_client")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("mtls_client")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateSecurityContext(ctx context.Context, formats strfmt.Registry) error {

	if m.SecurityContext != nil {
		if err := m.SecurityContext.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("securityContext")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("securityContext")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateServer(ctx context.Context, formats strfmt.Registry) error {

	if m.Server != nil {
		if err := m.Server.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("server")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("server")
			}
			return err
		}
	}

	return nil
}

func (m *EncryptionConfigurationResponse) contextValidateVault(ctx context.Context, formats strfmt.Registry) error {

	if m.Vault != nil {
		if err := m.Vault.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("vault")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("vault")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *EncryptionConfigurationResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *EncryptionConfigurationResponse) UnmarshalBinary(b []byte) error {
	var res EncryptionConfigurationResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
