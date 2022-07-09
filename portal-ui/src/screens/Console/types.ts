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

export interface ISessionPermissions {
  [key: string]: string[];
}

export interface IAllowResources {
  conditionOperator: string;
  prefixes: string[];
  resource: string;
}

export interface ISessionResponse {
  status: string;
  features: string[];
  operator: boolean;
  distributedMode: boolean;
  permissions: ISessionPermissions;
  allowResources: IAllowResources[] | null;
}
