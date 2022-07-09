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

import React, { Fragment, useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid } from "@mui/material";
import {
  AddIcon,
  IAMPoliciesIcon,
  PasswordKeyIcon,
  TrashIcon,
  UsersIcon,
} from "../../../icons";

import {
  actionsTray,
  containerForHeader,
  searchField,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { IPolicyItem } from "./types";
import { ErrorResponseHandler } from "../../../common/types";
import PageHeader from "../Common/PageHeader/PageHeader";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import ChangeUserGroups from "./ChangeUserGroups";
import SetUserPolicies from "./SetUserPolicies";
import UserServiceAccountsPanel from "./UserServiceAccountsPanel";
import ChangeUserPasswordModal from "../Account/ChangeUserPasswordModal";
import DeleteUser from "./DeleteUser";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import PanelTitle from "../Common/PanelTitle/PanelTitle";
import PageLayout from "../Common/Layout/PageLayout";
import VerticalTabs from "../Common/VerticalTabs/VerticalTabs";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import BackLink from "../../../common/BackLink";
import RBIconButton from "../Buckets/BucketDetails/SummaryItems/RBIconButton";
import { decodeURLString, encodeURLString } from "../../../common/utils";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../common/SecureComponent";
import { useAppDispatch } from "../../../store";

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      border: "1px solid #EAEAEA",
    },
    statusLabel: {
      fontSize: ".8rem",
      marginRight: ".5rem",
    },
    statusValue: {
      fontWeight: "bold",
      fontSize: ".9rem",
      marginRight: ".5rem",
    },
    ...actionsTray,
    ...searchField,
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

interface IUserDetailsProps {
  classes: any;
}

interface IGroupItem {
  group: string;
}

const UserDetails = ({ classes }: IUserDetailsProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);

  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [currentGroups, setCurrentGroups] = useState<IGroupItem[]>([]);
  const [currentPolicies, setCurrentPolicies] = useState<IPolicyItem[]>([]);
  const [changeUserPasswordModalOpen, setChangeUserPasswordModalOpen] =
    useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [hasPolicy, setHasPolicy] = useState<boolean>(false);

  const userName = decodeURLString(params.userName || "");

  const changeUserPassword = () => {
    setChangeUserPasswordModalOpen(true);
  };

  const deleteUser = () => {
    setDeleteOpen(true);
  };

  const viewGroup = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_GROUP,
  ]);

  const getUserInformation = useCallback(() => {
    if (userName === "") {
      return null;
    }
    setLoading(true);
    api
      .invoke("GET", `/api/v1/user/${encodeURLString(userName)}`)
      .then((res) => {
        setAddLoading(false);
        const memberOf = res.memberOf || [];
        setSelectedGroups(memberOf);
        let currentGroups: IGroupItem[] = [];
        for (let group of memberOf) {
          currentGroups.push({
            group: group,
          });
        }
        setCurrentGroups(currentGroups);
        let currentPolicies: IPolicyItem[] = [];
        for (let policy of res.policy) {
          currentPolicies.push({
            policy: policy,
          });
        }
        setCurrentPolicies(currentPolicies);
        setEnabled(res.status === "enabled");
        setHasPolicy(res.hasPolicy);
        setLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  }, [userName, dispatch]);

  const saveRecord = (isEnabled: boolean) => {
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("PUT", `/api/v1/user/${encodeURLString(userName)}`, {
        status: isEnabled ? "enabled" : "disabled",
        groups: selectedGroups,
      })
      .then((_) => {
        setAddLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  useEffect(() => {
    getUserInformation();
  }, [getUserInformation]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      getUserInformation();
    }
  };

  const groupViewAction = (group: any) => {
    navigate(`${IAM_PAGES.GROUPS}/${encodeURLString(group.group)}`);
  };

  const groupTableActions = [
    {
      type: "view",
      onClick: groupViewAction,
      disableButtonFunction: () => !viewGroup,
    },
  ];

  return (
    <Fragment>
      <PageHeader
        label={
          <Fragment>
            <BackLink label={"Users"} to={IAM_PAGES.USERS} />
          </Fragment>
        }
        actions={<React.Fragment></React.Fragment>}
      />
      {addGroupOpen && (
        <ChangeUserGroups
          open={addGroupOpen}
          selectedUser={userName}
          closeModalAndRefresh={() => {
            setAddGroupOpen(false);
            getUserInformation();
          }}
        />
      )}
      {policyOpen && (
        <SetUserPolicies
          open={policyOpen}
          selectedUser={userName}
          currentPolicies={currentPolicies}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
            getUserInformation();
          }}
        />
      )}
      {deleteOpen && (
        <DeleteUser
          deleteOpen={deleteOpen}
          selectedUsers={[userName]}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            closeDeleteModalAndRefresh(refresh);
          }}
        />
      )}
      {changeUserPasswordModalOpen && (
        <ChangeUserPasswordModal
          open={changeUserPasswordModalOpen}
          userName={userName}
          closeModal={() => setChangeUserPasswordModalOpen(false)}
        />
      )}
      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <UsersIcon width={40} />
              </Fragment>
            }
            title={userName}
            actions={
              <Fragment>
                <span className={classes.statusLabel}>User Status:</span>
                <span className={classes.statusValue}>
                  {enabled ? "Enabled" : "Disabled"}
                </span>
                <FormSwitchWrapper
                  indicatorLabels={["Enabled", "Disabled"]}
                  checked={enabled}
                  value={"group_enabled"}
                  id="group-status"
                  name="group-status"
                  onChange={() => {
                    setEnabled(!enabled);
                    saveRecord(!enabled);
                  }}
                  switchOnly
                />

                <RBIconButton
                  tooltip={"Delete User"}
                  text={""}
                  onClick={deleteUser}
                  icon={<TrashIcon />}
                  color="secondary"
                  variant={"outlined"}
                />

                <RBIconButton
                  tooltip={"Change Password"}
                  text={""}
                  onClick={changeUserPassword}
                  icon={<PasswordKeyIcon />}
                  color="primary"
                  variant={"outlined"}
                />
              </Fragment>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <VerticalTabs>
            {{
              tabConfig: {
                label: "Groups",
              },
              content: (
                <React.Fragment>
                  <div className={classes.actionsTray}>
                    <PanelTitle>Groups</PanelTitle>
                    <RBIconButton
                      tooltip={"Add to Groups"}
                      text={"Add to Groups"}
                      onClick={() => {
                        setAddGroupOpen(true);
                      }}
                      icon={<AddIcon />}
                      color="primary"
                      variant={"contained"}
                    />
                  </div>
                  <div className={classes.tableBlock}>
                    <TableWrapper
                      itemActions={groupTableActions}
                      columns={[{ label: "Name", elementKey: "group" }]}
                      isLoading={loading}
                      records={currentGroups}
                      entityName="Groups"
                      idField="group"
                    />
                  </div>
                </React.Fragment>
              ),
            }}
            {{
              tabConfig: {
                label: "Service Accounts",
              },
              content: (
                <UserServiceAccountsPanel
                  user={userName}
                  hasPolicy={hasPolicy}
                />
              ),
            }}
            {{
              tabConfig: {
                label: "Policies",
              },
              content: (
                <Fragment>
                  <div className={classes.actionsTray}>
                    <PanelTitle>Policies</PanelTitle>

                    <RBIconButton
                      tooltip={"Assign Policies"}
                      text={"Assign Policies"}
                      onClick={() => {
                        setPolicyOpen(true);
                      }}
                      icon={<IAMPoliciesIcon />}
                      color="primary"
                      variant={"contained"}
                    />
                  </div>
                  <div className={classes.tableBlock}>
                    <TableWrapper
                      itemActions={[
                        {
                          type: "view",
                          onClick: (policy: IPolicyItem) => {
                            navigate(
                              `${IAM_PAGES.POLICIES}/${encodeURLString(
                                policy.policy
                              )}`
                            );
                          },
                        },
                      ]}
                      columns={[{ label: "Name", elementKey: "policy" }]}
                      isLoading={loading}
                      records={currentPolicies}
                      entityName="Policies"
                      idField="policy"
                    />
                  </div>
                </Fragment>
              ),
            }}
          </VerticalTabs>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(UserDetails);
