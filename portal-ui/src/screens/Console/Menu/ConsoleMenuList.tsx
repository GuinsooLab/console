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

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import {
  menuItemContainerStyles,
  menuItemIconStyles,
  menuItemMiniStyles,
  menuItemTextStyles,
} from "./MenuStyleUtils";
import MenuItem from "./MenuItem";

import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

const ConsoleMenuList = ({
  menuItems,
  onLogoutClick,
  isOpen,
}: {
  menuItems: any[];
  isOpen: boolean;
  onLogoutClick: () => void;
}) => {
  const stateClsName = isOpen ? "wide" : "mini";
  const { pathname = "" } = useLocation();
  let groupToSelect = pathname.slice(1, pathname.length); //single path
  if (groupToSelect.indexOf("/") !== -1) {
    groupToSelect = groupToSelect.slice(0, groupToSelect.indexOf("/")); //nested path
  }

  const [expandGroup, setExpandGroup] = useState(IAM_PAGES.BUCKETS);
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<string>(groupToSelect);

  const [previewMenuGroup, setPreviewMenuGroup] = useState<string>("");

  useEffect(() => {
    setExpandGroup(groupToSelect);
    setSelectedMenuItem(groupToSelect);
  }, [groupToSelect]);

  return (
    <Box
      className={`${stateClsName} wrapper`}
      sx={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-between",
        height: "100%",
        flex: 1,

        "&.wide": {
          paddingLeft: "8px",
        },

        "&.mini": {
          marginLeft: "8px",
        },
      }}
    >
      <List
        sx={{
          flex: 1,
          paddingTop: 0,

          "&.mini": {
            padding: 0,
            display: "flex",
            alignItems: "center",
            flexFlow: "column",

            "& .main-menu-item": {
              paddingLeft: 8,
            },
          },
        }}
        className={`${stateClsName} group-wrapper main-list`}
      >
        <React.Fragment>
          {(menuItems || []).map((menuGroup: any, index) => {
            if (menuGroup) {
              return (
                <MenuItem
                  stateClsName={stateClsName}
                  page={menuGroup}
                  key={`${menuGroup.id}-${index.toString()}`}
                  id={menuGroup.id}
                  selectedMenuItem={selectedMenuItem}
                  setSelectedMenuItem={setSelectedMenuItem}
                  pathValue={pathname}
                  onExpand={setExpandGroup}
                  expandedGroup={expandGroup}
                  previewMenuGroup={previewMenuGroup}
                  setPreviewMenuGroup={setPreviewMenuGroup}
                />
              );
            }
            return null;
          })}
        </React.Fragment>
      </List>
      {/* List of Bottom anchored menus */}
      <List
        sx={{
          paddingTop: 0,
          "&.mini": {
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexFlow: "column",
          },
        }}
        className={`${stateClsName} group-wrapper bottom-list`}
      >
        <ListItem
          button
          onClick={onLogoutClick}
          disableRipple
          sx={{
            ...menuItemContainerStyles,
            ...menuItemMiniStyles,
            marginBottom: "3px",
          }}
          className={`$ ${stateClsName} bottom-menu-item`}
        >
          <ListItemIcon
            sx={{
              ...menuItemIconStyles,
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            id={"logout"}
            sx={{ ...menuItemTextStyles }}
            className={stateClsName}
          />
        </ListItem>
      </List>
    </Box>
  );
};
export default ConsoleMenuList;
