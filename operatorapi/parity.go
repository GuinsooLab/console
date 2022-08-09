// This file is part of GuinsooLab Console Server
// Copyright (c) 2020-2022 GuinsooLab, Inc.
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

package operatorapi

import (
	"context"
	"fmt"

	errors "github.com/GuinsooLab/console/restapi"

	"github.com/GuinsooLab/console/pkg/utils"

	"github.com/GuinsooLab/console/models"
	"github.com/GuinsooLab/console/operatorapi/operations"
	"github.com/GuinsooLab/console/operatorapi/operations/operator_api"
	"github.com/go-openapi/runtime/middleware"
)

func registerParityHandlers(api *operations.OperatorAPI) {
	api.OperatorAPIGetParityHandler = operator_api.GetParityHandlerFunc(func(params operator_api.GetParityParams, principal *models.Principal) middleware.Responder {
		resp, err := getParityResponse(params)
		if err != nil {
			return operator_api.NewGetParityDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewGetParityOK().WithPayload(resp)
	})
}

func GetParityInfo(nodes int64, disksPerNode int64) (models.ParityResponse, error) {
	parityVals, err := utils.PossibleParityValues(fmt.Sprintf(`http://minio{1...%d}/export/set{1...%d}`, nodes, disksPerNode))
	if err != nil {
		return nil, err
	}

	return parityVals, nil
}

func getParityResponse(params operator_api.GetParityParams) (models.ParityResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	nodes := params.Nodes
	disksPerNode := params.DisksPerNode
	parityValues, err := GetParityInfo(nodes, disksPerNode)
	if err != nil {
		errors.LogError("error getting parity info: %v", err)
		return nil, errors.ErrorWithContext(ctx, err)
	}
	return parityValues, nil
}
