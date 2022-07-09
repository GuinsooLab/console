// This file is part of GuinsooLab Console Server
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

import UserSelector from "./UserSelector";
import PasswordSelector from "./PasswordSelector";
import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { createUserAsync, resetFormAsync } from "./thunk/AddUsersThunk";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import { CreateUserIcon } from "../../../icons";

import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";

import PolicySelectors from "../Policies/PolicySelectors";
import BackLink from "../../../common/BackLink";
import GroupsSelectors from "./GroupsSelectors";

import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { useNavigate } from "react-router-dom";
import FormLayout from "../Common/FormLayout";
import AddUserHelpBox from "./AddUserHelpBox";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import {
  setSelectedGroups,
  setAddLoading,
  setSendEnabled,
} from "./AddUsersSlice";
interface IAddUserProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    bottomContainer: {
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
      margin: "auto",
      justifyContent: "center",
      "& div": {
        width: 150,
        "@media (max-width: 900px)": {
          flexFlow: "column",
        },
      },
    },
    ...formFieldStyles,
    ...modalStyleUtils,
  });

const AddUser = ({ classes }: IAddUserProps) => {
  const dispatch = useAppDispatch();
  const selectedPolicies = useSelector(
    (state: AppState) => state.createUser.selectedPolicies
  );
  const selectedGroups = useSelector(
    (state: AppState) => state.createUser.selectedGroups
  );
  const addLoading = useSelector(
    (state: AppState) => state.createUser.addLoading
  );
  const sendEnabled = useSelector(
    (state: AppState) => state.createUser.sendEnabled
  );
  const secretKeylength = useSelector(
    (state: AppState) => state.createUser.secretKeylength
  );
  const navigate = useNavigate();
  dispatch(setSendEnabled());

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (secretKeylength < 8) {
      dispatch(
        setErrorSnackMessage({
          errorMessage: "Passwords must be at least 8 characters long",
          detailedError: "",
        })
      );
      dispatch(setAddLoading(false));
      return;
    }
    if (addLoading) {
      return;
    }
    dispatch(setAddLoading(true));
    dispatch(createUserAsync())
      .unwrap() // <-- async Thunk returns a promise, that can be 'unwrapped')
      .then(() => navigate(`${IAM_PAGES.USERS}`));
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader label={<BackLink to={IAM_PAGES.USERS} label={"Users"} />} />
        <PageLayout>
          <FormLayout
            title={"Create User"}
            icon={<CreateUserIcon />}
            helpbox={<AddUserHelpBox />}
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                saveRecord(e);
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <div className={classes.formFieldRow}>
                    <UserSelector classes={classes} />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.formFieldRow}>
                    <PasswordSelector classes={classes} />
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <PolicySelectors selectedPolicy={selectedPolicies} />
                </Grid>
                <Grid item xs={12}>
                  <GroupsSelectors
                    selectedGroups={selectedGroups}
                    setSelectedGroups={(elements: string[]) => {
                      dispatch(setSelectedGroups(elements));
                    }}
                  />
                </Grid>
                {addLoading && (
                  <Grid item xs={12}>
                    <LinearProgress />
                  </Grid>
                )}

                <Grid item xs={12} className={classes.modalButtonBar}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={(e) => {
                      dispatch(resetFormAsync());
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={addLoading || !sendEnabled}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormLayout>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(AddUser);
