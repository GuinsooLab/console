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

import React, { useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { Button, Grid } from "@mui/material";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../Common/FormComponents/common/styleLibrary";

import api from "../../../../common/api";
import { ErrorResponseHandler } from "../../../../common/types";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { AddAccessRuleIcon } from "../../../../icons";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IAddAccessRule {
  classes: any;
  modalOpen: boolean;
  onClose: () => any;
  bucket: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const AddAccessRule = ({
  modalOpen,
  onClose,
  classes,
  bucket,
}: IAddAccessRule) => {
  const dispatch = useAppDispatch();

  const [prefix, setPrefix] = useState("");
  const [selectedAccess, setSelectedAccess] = useState<any>("readonly");

  const accessOptions = [
    { label: "readonly", value: "readonly" },
    { label: "writeonly", value: "writeonly" },
    { label: "readwrite", value: "readwrite" },
  ];

  const resetForm = () => {
    setPrefix("");
    setSelectedAccess("readonly");
  };

  const createProcess = () => {
    api
      .invoke("PUT", `/api/v1/bucket/${bucket}/access-rules`, {
        prefix: prefix,
        access: selectedAccess,
      })
      .then((res: any) => {
        onClose();
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
        onClose();
      });
  };

  return (
    <ModalWrapper
      modalOpen={modalOpen}
      title="Add Access Rule"
      onClose={onClose}
      titleIcon={<AddAccessRuleIcon />}
    >
      <Grid container>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            value={prefix}
            label={"Prefix"}
            id={"prefix"}
            name={"prefix"}
            placeholder={"Enter Prefix"}
            onChange={(e) => {
              setPrefix(e.target.value);
            }}
            tooltip={
              "Leave this field blank to apply the rule to all prefixes and objects at the bucket root. Do not include the wildcard asterisk ``*`` as part of the prefix *unless* it is an explicit part of the prefix name. The Console automatically appends an asterisk to the appropriate sections of the resulting IAM policy."
            }
          />
        </Grid>
        <Grid item xs={12}>
          <SelectWrapper
            id="access"
            name="Access"
            onChange={(e) => {
              setSelectedAccess(e.target.value);
            }}
            label="Access"
            value={selectedAccess}
            options={accessOptions}
            disabled={false}
          />
        </Grid>
        <Grid item xs={12} className={classes.modalButtonBar}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={resetForm}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={prefix.trim() === ""}
            onClick={createProcess}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(AddAccessRule);
