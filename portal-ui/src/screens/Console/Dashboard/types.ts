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

import { IDashboardPanel } from "./Prometheus/types";

export interface Usage {
  usage: number;
  buckets: number;
  objects: number;
  prometheusNotReady?: boolean;
  widgets?: any;
  servers: ServerInfo[];
  //TODO
  lastScan: any;
  lastHeal: any;
  upTime: any;
}

export interface ServerInfo {
  state: string;
  endpoint: string;
  uptime: string;
  version: string;
  commitID: string;
  poolNumber: number;
  drives: IDriveInfo[];
  network: any;
}

export interface IDriveInfo {
  state: string;
  uuid: string;
  endpoint: string;
  drivePath: string;
  rootDisk: boolean;
  healing: boolean;
  model: string;
  totalSpace: number;
  usedSpace: number;
  availableSpace: number;
}

export interface zoomState {
  openZoom: boolean;
  widgetRender: null | IDashboardPanel;
}
