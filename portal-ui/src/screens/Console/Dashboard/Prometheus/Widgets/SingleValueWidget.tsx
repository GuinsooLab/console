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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import api from "../../../../../common/api";
import Loader from "../../../Common/Loader/Loader";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { splitSizeMetric, widgetDetailsToPanel } from "../utils";
import { IDashboardPanel } from "../types";
import { ErrorResponseHandler } from "../../../../../common/types";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { useAppDispatch } from "../../../../../store";

interface ISingleValueWidget {
  title: string;
  panelItem: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;

  classes: any;
  apiPrefix: string;
  renderFn?: (arg: Record<string, any>) => any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
    loadingAlign: {
      width: "100%",
      textAlign: "center",
      margin: "auto",
    },
    metric: {
      fontSize: 60,
      lineHeight: 1,
      color: "#07193E",
      fontWeight: 700,
    },
    titleElement: {
      fontSize: 10,
      color: "#767676",
      fontWeight: 700,
    },
    containerAlignment: {
      display: "flex",
      height: 140,
      flexDirection: "column",
      justifyContent: "center",
      "& .unitText": {
        color: "#767676",
        fontSize: 12,
      },
    },
  });

const SingleValueWidget = ({
  title,
  panelItem,
  timeStart,
  timeEnd,
  propLoading,
  classes,
  apiPrefix,
  renderFn,
}: ISingleValueWidget) => {
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

  const valueToRender = splitSizeMetric(data);

  if (renderFn) {
    return renderFn({ valueToRender, loading, title, id: panelItem.id });
  }
  return (
    <div className={classes.containerAlignment}>
      {loading && (
        <div className={classes.loadingAlign}>
          <Loader />
        </div>
      )}
      {!loading && (
        <Fragment>
          <div className={classes.metric}>{splitSizeMetric(data)}</div>
          <div className={classes.titleElement}>{title}</div>
        </Fragment>
      )}
    </div>
  );
};

const connector = connect(null, {
  setErrorSnackMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(SingleValueWidget));
