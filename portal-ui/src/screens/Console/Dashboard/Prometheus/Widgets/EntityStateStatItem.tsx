// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import api from "../../../../../common/api";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { IDashboardPanel } from "../types";
import Loader from "../../../Common/Loader/Loader";

import { setErrorSnackMessage } from "../../../../../systemSlice";
import { useAppDispatch } from "../../../../../store";

const EntityStateStatItem = ({
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  apiPrefix,
  statLabel,
}: {
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  apiPrefix: string;
  statLabel: any;
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>("");

  useEffect(() => {
    if (propLoading) {
      setLoading(true);
    }
  }, [propLoading]);

  useEffect(() => {
    if (loading) {
      let stepCalc = 0;
      if (timeStart !== null && timeEnd !== null) {
        const secondsInPeriod = timeEnd.unix() - timeStart.unix();
        const periods = Math.floor(secondsInPeriod / 60);

        stepCalc = periods < 1 ? 15 : periods;
      }

      api
        .invoke(
          "GET",
          `/api/v1/${apiPrefix}/info/widgets/${
            panelItem.id
          }/?step=${stepCalc}&${
            timeStart !== null ? `&start=${timeStart.unix()}` : ""
          }${timeStart !== null && timeEnd !== null ? "&" : ""}${
            timeEnd !== null ? `end=${timeEnd.unix()}` : ""
          }`
        )
        .then((res: any) => {
          const widgetsWithValue = widgetDetailsToPanel(res, panelItem);
          setData(widgetsWithValue.data);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, panelItem, timeEnd, timeStart, dispatch, apiPrefix]);

  let toRender = loading ? (
    <Box
      sx={{
        width: "100%",
        paddingTop: "5px",
        textAlign: "center",
        margin: "auto",
      }}
    >
      <Loader style={{ width: 12, height: 12 }} />
    </Box>
  ) : (
    <Box>
      <Box className="stat-value">{data}</Box>
      {statLabel}
    </Box>
  );

  return toRender;
};

export default EntityStateStatItem;
