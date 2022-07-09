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

	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// TransitionResponse transition response
//
// swagger:model transitionResponse
type TransitionResponse struct {

	// date
	Date string `json:"date,omitempty"`

	// days
	Days int64 `json:"days,omitempty"`

	// noncurrent storage class
	NoncurrentStorageClass string `json:"noncurrent_storage_class,omitempty"`

	// noncurrent transition days
	NoncurrentTransitionDays int64 `json:"noncurrent_transition_days,omitempty"`

	// storage class
	StorageClass string `json:"storage_class,omitempty"`
}

// Validate validates this transition response
func (m *TransitionResponse) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this transition response based on context it is used
func (m *TransitionResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *TransitionResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *TransitionResponse) UnmarshalBinary(b []byte) error {
	var res TransitionResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
