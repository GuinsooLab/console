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

// SiteReplicationStatusResponse site replication status response
//
// swagger:model siteReplicationStatusResponse
type SiteReplicationStatusResponse struct {

	// bucket stats
	BucketStats interface{} `json:"bucketStats,omitempty"`

	// enabled
	Enabled bool `json:"enabled,omitempty"`

	// group stats
	GroupStats interface{} `json:"groupStats,omitempty"`

	// max buckets
	MaxBuckets int64 `json:"maxBuckets,omitempty"`

	// max groups
	MaxGroups int64 `json:"maxGroups,omitempty"`

	// max policies
	MaxPolicies int64 `json:"maxPolicies,omitempty"`

	// max users
	MaxUsers int64 `json:"maxUsers,omitempty"`

	// policy stats
	PolicyStats interface{} `json:"policyStats,omitempty"`

	// sites
	Sites interface{} `json:"sites,omitempty"`

	// stats summary
	StatsSummary interface{} `json:"statsSummary,omitempty"`

	// user stats
	UserStats interface{} `json:"userStats,omitempty"`
}

// Validate validates this site replication status response
func (m *SiteReplicationStatusResponse) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this site replication status response based on context it is used
func (m *SiteReplicationStatusResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *SiteReplicationStatusResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *SiteReplicationStatusResponse) UnmarshalBinary(b []byte) error {
	var res SiteReplicationStatusResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
