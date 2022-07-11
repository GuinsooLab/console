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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";

import { configurationElements } from "../utils";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";
import HelpBox from "../../../../common/HelpBox";
import { SettingsIcon } from "../../../../icons";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import VerticalTabs from "../../Common/VerticalTabs/VerticalTabs";
import PageLayout from "../../Common/Layout/PageLayout";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";

import withSuspense from "../../Common/Components/withSuspense";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";

const ConfigurationForm = withSuspense(
  React.lazy(() => import("./ConfigurationForm"))
);

interface IConfigurationOptions {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    settingsOptionsContainer: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "flex-start" as const,
      flexWrap: "wrap" as const,
      border: "#E5E5E5 1px solid",
      borderRadius: 2,
      backgroundColor: "#fff",
    },
    ...searchField,
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
  });

const getRoutePath = (path: string) => {
  return `${IAM_PAGES.SETTINGS}/${path}`;
};

const ConfigurationOptions = ({ classes }: IConfigurationOptions) => {
  const { pathname = "" } = useLocation();

  let selConfigTab = pathname.substring(pathname.lastIndexOf("/") + 1);
  selConfigTab = selConfigTab === "settings" ? "region" : selConfigTab;

  return (
    <Fragment>
      <PageHeader label={"Configurations"} />

      <PageLayout>
        <Grid item xs={12}>
          <div
            id="settings-container"
            className={classes.settingsOptionsContainer}
          >
            <ScreenTitle icon={<SettingsIcon />} title={"Configuration"} />
            <VerticalTabs
              selectedTab={selConfigTab}
              isRouteTabs
              routes={
                <Routes>
                  {configurationElements.map((element) => (
                    <Route
                      key={`configItem-${element.configuration_label}`}
                      path={`${element.configuration_id}`}
                      element={<ConfigurationForm />}
                    />
                  ))}
                  <Route
                    path={"/"}
                    element={<Navigate to={`${IAM_PAGES.SETTINGS}/region`} />}
                  />
                </Routes>
              }
            >
              {configurationElements.map((element) => {
                const { configuration_id, configuration_label, icon } = element;
                return {
                  tabConfig: {
                    label: configuration_label,
                    value: configuration_id,
                    icon: icon,
                    component: Link,
                    to: getRoutePath(configuration_id),
                  },
                };
              })}
            </VerticalTabs>
          </div>
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: "15px" }}>
          <HelpBox
            title={"Learn more about CONFIGURATIONS"}
            iconComponent={<SettingsIcon />}
            help={
              <Fragment>
                AnnaStore supports a variety of configurations ranging from
                encryption, compression, region, notifications, etc.
                <br />
                <br />
                You can learn more at our{" "}
                <a
                  href="https://github.com/GuinsooLab/annastore"
                  target="_blank"
                  rel="noreferrer"
                >
                  documentation
                </a>
                .
              </Fragment>
            }
          />
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(ConfigurationOptions);
