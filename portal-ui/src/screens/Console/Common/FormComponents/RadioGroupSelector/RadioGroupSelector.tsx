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
import clsx from "clsx";
import Grid from "@mui/material/Grid";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio, { RadioProps } from "@mui/material/Radio";
import { InputLabel, Tooltip } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import makeStyles from "@mui/styles/makeStyles";
import { fieldBasic, radioIcons, tooltipHelper } from "../common/styleLibrary";
import HelpIcon from "../../../../../icons/HelpIcon";

export interface SelectorTypes {
  label: string;
  value: string;
}

interface RadioGroupProps {
  selectorOptions: SelectorTypes[];
  currentSelection: string;
  label: string;
  id: string;
  name: string;
  tooltip?: string;
  disableOptions?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  classes: any;
  displayInColumn?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...tooltipHelper,
    optionLabel: {
      "&.Mui-disabled": {
        "& .MuiFormControlLabel-label": {
          color: "#9c9c9c",
        },
      },
      "&:last-child": {
        marginRight: 0,
      },
      "& .MuiFormControlLabel-label": {
        fontSize: 12,
        color: "#07193E",
      },
    },
    checkedOption: {
      "& .MuiFormControlLabel-label": {
        fontSize: 12,
        color: "#07193E",
        fontWeight: 700,
      },
    },
  });

const radioStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  ...radioIcons,
});

const RadioButton = (props: RadioProps) => {
  const classes = radioStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={classes.radioSelectedIcon} />}
      icon={<span className={classes.radioUnselectedIcon} />}
      {...props}
    />
  );
};

export const RadioGroupSelector = ({
  selectorOptions = [],
  currentSelection,
  label,
  id,
  name,
  onChange,
  tooltip = "",
  disableOptions = false,
  classes,
  displayInColumn = false,
}: RadioGroupProps) => {
  return (
    <Grid container alignItems={"center"}>
      <Grid item xs>
        <InputLabel htmlFor={id} className={classes.inputLabel}>
          <span>{label}</span>
          {tooltip !== "" && (
            <div className={classes.tooltipContainer}>
              <Tooltip title={tooltip} placement="top-start">
                <div>
                  <HelpIcon />
                </div>
              </Tooltip>
            </div>
          )}
        </InputLabel>
      </Grid>
      <Grid item xs className={classes.radioOptionsLayout}>
        <RadioGroup
          aria-label={id}
          id={id}
          name={name}
          value={currentSelection}
          onChange={onChange}
          row={!displayInColumn}
          style={{ display: "block", textAlign: "right" }}
        >
          {selectorOptions.map((selectorOption) => {
            return (
              <FormControlLabel
                key={`rd-${name}-${selectorOption.value}`}
                value={selectorOption.value}
                control={<RadioButton />}
                label={selectorOption.label}
                disabled={disableOptions}
                className={clsx(classes.optionLabel, {
                  [classes.checkedOption]:
                    selectorOption.value === currentSelection,
                })}
              />
            );
          })}
        </RadioGroup>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(RadioGroupSelector);
