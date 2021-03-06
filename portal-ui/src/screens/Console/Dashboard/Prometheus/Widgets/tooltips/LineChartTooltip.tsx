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

import React from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { getTimeFromTimestamp } from "../../../../../../common/utils";
import { tooltipCommon } from "../../../../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...tooltipCommon,
  });

const LineChartTooltip = ({
  active,
  payload,
  label,
  linearConfiguration,
  yAxisFormatter,
  classes,
}: any) => {
  if (active) {
    return (
      <div className={classes.customTooltip}>
        <div className={classes.timeStampTitle}>
          {getTimeFromTimestamp(label, true)}
        </div>
        {payload &&
          payload.map((pl: any, index: number) => {
            return (
              <div
                className={classes.labelContainer}
                key={`lbPl-${index}-${linearConfiguration[index].keyLabel}`}
              >
                <div
                  className={classes.labelColor}
                  style={{
                    backgroundColor: linearConfiguration[index].lineColor,
                  }}
                />
                <div className={classes.itemValue}>
                  <span className={classes.valueContainer}>
                    {linearConfiguration[index].keyLabel}:{" "}
                    {yAxisFormatter(pl.value)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  return null;
};

export default withStyles(styles)(LineChartTooltip);
