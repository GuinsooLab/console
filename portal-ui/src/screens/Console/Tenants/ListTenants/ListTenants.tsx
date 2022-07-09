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

import Grid from "@mui/material/Grid";
import { LinearProgress, SelectChangeEvent } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { ITenant, ITenantsResponse } from "./types";
import { niceBytes } from "../../../../common/utils";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";

import { AddIcon, TenantsIcon } from "../../../../icons";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import RefreshIcon from "../../../../icons/RefreshIcon";
import PageHeader from "../../Common/PageHeader/PageHeader";
import TenantListItem from "./TenantListItem";
import HelpBox from "../../../../common/HelpBox";
import AButton from "../../Common/AButton/AButton";

import withSuspense from "../../Common/Components/withSuspense";
import VirtualizedList from "../../Common/VirtualizedList/VirtualizedList";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import SearchBox from "../../Common/SearchBox";
import PageLayout from "../../Common/Layout/PageLayout";
import { setErrorSnackMessage } from "../../../../systemSlice";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../store";

const CredentialsPrompt = withSuspense(
  React.lazy(() => import("../../Common/CredentialsPrompt/CredentialsPrompt"))
);

interface ITenantsList {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
    theaderSearch: {
      borderColor: theme.palette.grey["200"],
      "& .MuiInputBase-input": {
        paddingTop: 10,
        paddingBottom: 10,
      },
      "& .MuiInputBase-root": {
        "& .MuiInputAdornment-root": {
          "& .min-icon": {
            color: theme.palette.grey["400"],
            height: 14,
          },
        },
      },
      actionHeaderItems: {
        "@media (min-width: 320px)": {
          marginTop: 8,
        },
      },
      marginRight: 10,
      marginLeft: 10,
    },
    tenantsList: {
      height: "calc(100vh - 195px)",
    },
    sortByContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: 10,
    },
    innerSort: {
      maxWidth: 200,
      width: "95%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    sortByLabel: {
      whiteSpace: "nowrap",
      fontSize: 14,
      color: "#838383",
      fontWeight: "bold",
      marginRight: 10,
    },
  });

const ListTenants = ({ classes }: ITenantsList) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterTenants, setFilterTenants] = useState<string>("");
  const [records, setRecords] = useState<ITenant[]>([]);
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [createdAccount, setCreatedAccount] =
    useState<NewServiceAccount | null>(null);
  const [sortValue, setSortValue] = useState<string>("name");

  const closeCredentialsModal = () => {
    setShowNewCredentials(false);
    setCreatedAccount(null);
  };

  const filteredRecords = records.filter((b: any) => {
    if (filterTenants === "") {
      return true;
    } else {
      if (b.name.indexOf(filterTenants) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  });

  filteredRecords.sort((a, b) => {
    switch (sortValue) {
      case "capacity":
        if (!a.capacity || !b.capacity) {
          return 0;
        }

        if (a.capacity > b.capacity) {
          return 1;
        }

        if (a.capacity < b.capacity) {
          return -1;
        }

        return 0;
      case "usage":
        if (!a.capacity_usage || !b.capacity_usage) {
          return 0;
        }

        if (a.capacity_usage > b.capacity_usage) {
          return 1;
        }

        if (a.capacity_usage < b.capacity_usage) {
          return -1;
        }

        return 0;
      case "active_status":
        if (a.health_status === "red" && b.health_status !== "red") {
          return 1;
        }

        if (a.health_status !== "red" && b.health_status === "red") {
          return -1;
        }

        return 0;
      case "failing_status":
        if (a.health_status === "green" && b.health_status !== "green") {
          return 1;
        }

        if (a.health_status !== "green" && b.health_status === "green") {
          return -1;
        }

        return 0;
      default:
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
    }
  });

  useEffect(() => {
    if (isLoading) {
      const fetchRecords = () => {
        api
          .invoke("GET", `/api/v1/tenants`)
          .then((res: ITenantsResponse) => {
            if (res === null) {
              setIsLoading(false);
              return;
            }
            let resTenants: ITenant[] = [];
            if (res.tenants !== null) {
              resTenants = res.tenants;
            }

            for (let i = 0; i < resTenants.length; i++) {
              resTenants[i].total_capacity = niceBytes(
                resTenants[i].total_size + ""
              );
            }

            setRecords(resTenants);
            setIsLoading(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setIsLoading(false);
          });
      };
      fetchRecords();
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const renderItemLine = (index: number) => {
    const tenant = filteredRecords[index] || null;

    if (tenant) {
      return <TenantListItem tenant={tenant} />;
    }

    return null;
  };

  return (
    <Fragment>
      {showNewCredentials && (
        <CredentialsPrompt
          newServiceAccount={createdAccount}
          open={showNewCredentials}
          closeModal={() => {
            closeCredentialsModal();
          }}
          entity="Tenant"
        />
      )}
      <PageHeader
        label="Tenants"
        middleComponent={
          <SearchBox
            placeholder={"Filter Tenants"}
            onChange={(val) => {
              setFilterTenants(val);
            }}
            value={filterTenants}
          />
        }
        actions={
          <Grid item xs={12} marginRight={"30px"}>
            <RBIconButton
              id={"refresh-tenant-list"}
              tooltip={"Refresh Tenant List"}
              text={""}
              onClick={() => {
                setIsLoading(true);
              }}
              icon={<RefreshIcon />}
              color="primary"
              variant={"outlined"}
            />
            <RBIconButton
              id={"create-tenant"}
              tooltip={"Create Tenant"}
              text={"Create Tenant"}
              onClick={() => {
                navigate("/tenants/add");
              }}
              icon={<AddIcon />}
              color="primary"
              variant={"contained"}
            />
          </Grid>
        }
      />
      <PageLayout>
        <Grid item xs={12} className={classes.tenantsList}>
          {isLoading && <LinearProgress />}
          {!isLoading && (
            <Fragment>
              {filteredRecords.length !== 0 && (
                <Fragment>
                  <Grid item xs={12} className={classes.sortByContainer}>
                    <div className={classes.innerSort}>
                      <span className={classes.sortByLabel}>Sort by</span>
                      <SelectWrapper
                        id={"sort-by"}
                        label={""}
                        value={sortValue}
                        onChange={(e: SelectChangeEvent<string>) => {
                          setSortValue(e.target.value as string);
                        }}
                        name={"sort-by"}
                        options={[
                          { label: "Name", value: "name" },
                          {
                            label: "Capacity",
                            value: "capacity",
                          },
                          {
                            label: "Usage",
                            value: "usage",
                          },
                          {
                            label: "Active Status",
                            value: "active_status",
                          },
                          {
                            label: "Failing Status",
                            value: "failing_status",
                          },
                        ]}
                      />
                    </div>
                  </Grid>
                  <VirtualizedList
                    rowRenderFunction={renderItemLine}
                    totalItems={filteredRecords.length}
                  />
                </Fragment>
              )}
              {filteredRecords.length === 0 && (
                <Grid
                  container
                  justifyContent={"center"}
                  alignContent={"center"}
                  alignItems={"center"}
                >
                  <Grid item xs={8}>
                    <HelpBox
                      iconComponent={<TenantsIcon />}
                      title={"Tenants"}
                      help={
                        <Fragment>
                          Tenant is the logical structure to represent a MinIO
                          deployment. A tenant can have different size and
                          configurations from other tenants, even a different
                          storage class.
                          <br />
                          <br />
                          To get started,&nbsp;
                          <AButton
                            onClick={() => {
                              navigate("/tenants/add");
                            }}
                          >
                            Create a Tenant.
                          </AButton>
                        </Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Fragment>
          )}
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(ListTenants);
