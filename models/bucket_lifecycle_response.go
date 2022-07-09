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
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// BucketLifecycleResponse bucket lifecycle response
//
// swagger:model bucketLifecycleResponse
type BucketLifecycleResponse struct {

	// lifecycle
	Lifecycle []*ObjectBucketLifecycle `json:"lifecycle"`
}

// Validate validates this bucket lifecycle response
func (m *BucketLifecycleResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateLifecycle(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *BucketLifecycleResponse) validateLifecycle(formats strfmt.Registry) error {
	if swag.IsZero(m.Lifecycle) { // not required
		return nil
	}

	for i := 0; i < len(m.Lifecycle); i++ {
		if swag.IsZero(m.Lifecycle[i]) { // not required
			continue
		}

		if m.Lifecycle[i] != nil {
			if err := m.Lifecycle[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("lifecycle" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("lifecycle" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// ContextValidate validate this bucket lifecycle response based on the context it is used
func (m *BucketLifecycleResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateLifecycle(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *BucketLifecycleResponse) contextValidateLifecycle(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Lifecycle); i++ {

		if m.Lifecycle[i] != nil {
			if err := m.Lifecycle[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("lifecycle" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("lifecycle" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *BucketLifecycleResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *BucketLifecycleResponse) UnmarshalBinary(b []byte) error {
	var res BucketLifecycleResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}