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

export const menuItemContainerStyles: any = {
  paddingLeft: 0,
  "&.active div:nth-of-type(1)": {
    background: "#EAEAEA",
  },
  "&:hover, &:focus": {
    background: "#EAEAEA",
  },
};
export const menuItemIconStyles: any = {
  width: 16,
  minWidth: 16,
  height: 16,
  display: "flex",
  alignItems: "center",

  "& svg": {
    width: 16,
    height: 16,
    fill: "#061d41",
  },
};

export const menuItemTextStyles: any = {
  color: "#061d41",
  fontSize: "14px",
  marginLeft: "8px",
  "& span": {
    fontSize: "14px",
  },
  "&.mini": {
    display: "none",
  },
};

export const menuItemMiniStyles: any = {
  "&.mini": {
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "& .group-icon": {
      display: "none",
    },

    "&.active": {
      ".menu-icon": {
        border: "none",
      },
    },
  },
};

export const menuItemStyle: any = {
  paddingLeft: "8px",
  paddingRight: "8px",
  color: "#061d41",
  "&.active": {
    color: "#FFFFFF",
    ".menu-icon": {
      fill: "#061d41",
    },
  },
  "& .menu-icon": {
    maxWidth: "16px",
    minWidth: "16px",
    height: "16px",
  },
  "&:hover, &:focus": {
    background: "#EAEAEA",
  },
};
