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

import React, { useEffect, useState } from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import { IPolicyItem } from "../Users/types";
import { ErrorResponseHandler } from "../../../common/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import api from "../../../common/api";
import PolicySelectors from "../Policies/PolicySelectors";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";

interface ISetUserPoliciesProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: string;
  currentPolicies: IPolicyItem[];
  open: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    buttonContainer: {
      textAlign: "right",
      marginTop: ".9rem",
    },
  });

const SetUserPolicies = ({
  classes,
  closeModalAndRefresh,
  selectedUser,
  currentPolicies,
  open,
}: ISetUserPoliciesProps) => {
  const dispatch = useAppDispatch();
  //Local States
  const [loading, setLoading] = useState<boolean>(false);
  const [actualPolicy, setActualPolicy] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string[]>([]);

  const statePolicies = useSelector(
    (state: AppState) => state.createUser.selectedPolicies
  );

  const SetUserPoliciesAction = () => {
    let entity = "user";
    let value = selectedUser;

    setLoading(true);

    api
      .invoke("PUT", `/api/v1/set-policy`, {
        name: statePolicies,
        entityName: value,
        entityType: entity,
      })
      .then(() => {
        setLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  const resetSelection = () => {
    setSelectedPolicy(actualPolicy);
  };

  useEffect(() => {
    if (open) {
      const userPolicy: string[] = [];
      for (let pol of currentPolicies) {
        userPolicy.push(pol.policy);
      }
      setActualPolicy(userPolicy);
      setSelectedPolicy(userPolicy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedUser]);

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh();
      }}
      modalOpen={open}
      title="Set Policies"
    >
      <Grid container>
        <Grid item xs={12}>
          <PolicySelectors selectedPolicy={selectedPolicy} />
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <button
          type="button"
          color="primary"
          className={classes.clearButton}
          onClick={resetSelection}
        >
          Reset
        </button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={SetUserPoliciesAction}
        >
          Save
        </Button>
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
    </ModalWrapper>
  );
};

export default withStyles(styles)(SetUserPolicies);
