// This file is part of MinIO Console Server
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

package config

import (
	"errors"
)

// EnsureCertAndKey checks if both client certificate and key paths are provided
func EnsureCertAndKey(clientCert, clientKey string) error {
	if (clientCert != "" && clientKey == "") ||
		(clientCert == "" && clientKey != "") {
		return errors.New("cert and key must be specified as a pair")
	}
	return nil
}
