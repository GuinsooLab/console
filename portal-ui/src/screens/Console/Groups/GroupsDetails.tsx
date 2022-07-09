import React, { Fragment, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import createStyles from "@mui/styles/createStyles";
import {
  actionsTray,
  containerForHeader,
  searchField,
  spacingUtils,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";

import withStyles from "@mui/styles/withStyles";
import { Grid } from "@mui/material";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import {
  AddIcon,
  GroupsIcon,
  IAMPoliciesIcon,
  TrashIcon,
} from "../../../icons";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import api from "../../../common/api";
import SetPolicy from "../Policies/SetPolicy";
import AddGroupMember from "./AddGroupMember";
import { ErrorResponseHandler } from "../../../common/types";
import DeleteGroup from "./DeleteGroup";
import VerticalTabs from "../Common/VerticalTabs/VerticalTabs";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import PageLayout from "../Common/Layout/PageLayout";
import PanelTitle from "../Common/PanelTitle/PanelTitle";
import SearchBox from "../Common/SearchBox";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import GroupDetailsHeader from "./GroupDetailsHeader";
import RBIconButton from "../Buckets/BucketDetails/SummaryItems/RBIconButton";
import { decodeURLString, encodeURLString } from "../../../common/utils";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      border: "1px solid #EAEAEA",
      width: "100%",
    },
    statusLabel: {
      fontSize: ".8rem",
      marginRight: ".7rem",
    },
    statusValue: {
      fontWeight: "bold",
      fontSize: ".9rem",
      marginRight: ".7rem",
    },
    searchField: {
      ...searchField.searchField,
      maxWidth: 280,
    },
    ...tableStyles,
    ...spacingUtils,
    actionsTray: {
      ...actionsTray.actionsTray,

      alignItems: "center",
      "& h1": {
        flex: 1,
      },
      "& button": {
        marginLeft: ".8rem",
      },
      "@media (max-width: 900px)": {
        justifyContent: "flex-end",
        "& h1": {
          display: "none",
        },
        "& button": {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      },
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface IGroupDetailsProps {
  classes: any;
}

type GroupInfo = {
  members?: any[];
  name?: string;
  policy?: string;
  status?: string;
};

export const formatPolicy = (policy: string = ""): string[] => {
  if (policy.length <= 0) return [];
  return policy.split(",");
};

const GroupsDetails = ({ classes }: IGroupDetailsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [groupDetails, setGroupDetails] = useState<GroupInfo>({});

  /*Modals*/
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [usersOpen, setUsersOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [memberFilter, setMemberFilter] = useState<string>("");

  const groupName = decodeURLString(params.groupName || "");

  const { members = [], policy = "", status: groupEnabled } = groupDetails;

  const filteredMembers = members.filter((elementItem) =>
    elementItem.includes(memberFilter)
  );

  useEffect(() => {
    if (groupName) {
      fetchGroupInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupName]);

  const groupPolicies = formatPolicy(policy);
  const isGroupEnabled = groupEnabled === "enabled";
  const memberActionText = members.length > 0 ? "Edit Members" : "Add Members";

  const getGroupDetails = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_GROUP,
  ]);

  function fetchGroupInfo() {
    if (getGroupDetails) {
      api
        .invoke("GET", `/api/v1/group/${encodeURLString(groupName)}`)
        .then((res: any) => {
          setGroupDetails(res);
        })
        .catch((err) => {
          dispatch(setModalErrorSnackMessage(err));
          setGroupDetails({});
        });
    }
  }

  function toggleGroupStatus(nextStatus: boolean) {
    return api
      .invoke("PUT", `/api/v1/group/${encodeURLString(groupName)}`, {
        group: groupName,
        members: members,
        status: nextStatus ? "enabled" : "disabled",
      })
      .then((res) => {
        fetchGroupInfo();
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setModalErrorSnackMessage(err));
      });
  }

  const groupsTabContent = (
    <React.Fragment>
      <div className={classes.actionsTray}>
        <PanelTitle>Members</PanelTitle>
        <SearchBox
          placeholder={"Search members"}
          onChange={(searchText) => {
            setMemberFilter(searchText);
          }}
          overrideClass={classes.searchField}
          value={memberFilter}
        />
        <SecureComponent
          resource={CONSOLE_UI_RESOURCE}
          scopes={[IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP]}
          errorProps={{ disabled: true }}
        >
          <RBIconButton
            tooltip={memberActionText}
            text={memberActionText}
            variant="contained"
            color="primary"
            icon={<AddIcon />}
            onClick={() => {
              setUsersOpen(true);
            }}
          />
        </SecureComponent>
      </div>

      <div className={classes.tableBlock}>
        <SecureComponent
          resource={CONSOLE_UI_RESOURCE}
          scopes={[IAM_SCOPES.ADMIN_LIST_USERS]}
          errorProps={{ disabled: true }}
        >
          <TableWrapper
            itemActions={[
              {
                type: "view",
                onClick: (userName) => {
                  navigate(`${IAM_PAGES.USERS}/${encodeURLString(userName)}`);
                },
              },
            ]}
            columns={[{ label: "Access Key", elementKey: "" }]}
            selectedItems={[]}
            isLoading={false}
            records={filteredMembers}
            entityName="Users"
            idField=""
          />
        </SecureComponent>
      </div>
    </React.Fragment>
  );

  const policiesTabContent = (
    <React.Fragment>
      <div className={classes.actionsTray}>
        <PanelTitle>Policies</PanelTitle>

        <RBIconButton
          tooltip={`Set Policies`}
          text={`Set Policies`}
          variant="contained"
          color="primary"
          icon={<IAMPoliciesIcon />}
          onClick={() => {
            setPolicyOpen(true);
          }}
        />
      </div>
      <div className={classes.tableBlock}>
        <TableWrapper
          itemActions={[
            {
              type: "view",
              onClick: (policy) => {
                navigate(`${IAM_PAGES.POLICIES}/${encodeURLString(policy)}`);
              },
            },
          ]}
          columns={[{ label: "Policy", elementKey: "" }]}
          isLoading={false}
          records={groupPolicies}
          entityName="Policies"
          idField=""
        />
      </div>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <GroupDetailsHeader />

      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <GroupsIcon width={40} />
              </Fragment>
            }
            title={groupName}
            subTitle={null}
            actions={
              <Fragment>
                <span className={classes.statusLabel}>Group Status:</span>
                <span id="group-status" className={classes.statusValue}>
                  {isGroupEnabled ? "Enabled" : "Disabled"}
                </span>
                <SecureComponent
                  resource={CONSOLE_UI_RESOURCE}
                  scopes={[
                    IAM_SCOPES.ADMIN_ENABLE_GROUP,
                    IAM_SCOPES.ADMIN_DISABLE_GROUP,
                  ]}
                  errorProps={{ disabled: true }}
                  matchAll
                >
                  <FormSwitchWrapper
                    indicatorLabels={["Enabled", "Disabled"]}
                    checked={isGroupEnabled}
                    value={"group_enabled"}
                    id="group-status"
                    name="group-status"
                    onChange={() => {
                      toggleGroupStatus(!isGroupEnabled);
                    }}
                    switchOnly
                  />
                </SecureComponent>

                <SecureComponent
                  resource={CONSOLE_UI_RESOURCE}
                  scopes={[IAM_SCOPES.ADMIN_REMOVE_USER_FROM_GROUP]}
                  errorProps={{ disabled: true }}
                >
                  <div className={classes.spacerLeft}>
                    <RBIconButton
                      tooltip={`Delete Group`}
                      text={``}
                      variant="outlined"
                      color="secondary"
                      icon={<TrashIcon />}
                      onClick={() => {
                        setDeleteOpen(true);
                      }}
                    />
                  </div>
                </SecureComponent>
              </Fragment>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <VerticalTabs>
            {{
              tabConfig: { label: "Members" },
              content: groupsTabContent,
            }}
            {{
              tabConfig: { label: "Policies" },
              content: policiesTabContent,
            }}
          </VerticalTabs>
        </Grid>
      </PageLayout>
      {/*Modals*/}
      {policyOpen ? (
        <SetPolicy
          open={policyOpen}
          selectedGroups={[groupName]}
          selectedUser={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
            fetchGroupInfo();
          }}
        />
      ) : null}

      {usersOpen ? (
        <AddGroupMember
          selectedGroup={groupName}
          onSaveClick={() => {}}
          title={memberActionText}
          groupStatus={groupEnabled}
          preSelectedUsers={members}
          open={usersOpen}
          onClose={() => {
            setUsersOpen(false);
            fetchGroupInfo();
          }}
        />
      ) : null}

      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroups={[groupName]}
          closeDeleteModalAndRefresh={(isDelSuccess: boolean) => {
            setDeleteOpen(false);
            if (isDelSuccess) {
              navigate(IAM_PAGES.GROUPS);
            }
          }}
        />
      )}
      {/*Modals*/}
    </React.Fragment>
  );
};

export default withStyles(styles)(GroupsDetails);
