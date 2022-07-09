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
    // "& div:nth-of-type(1)": {
    //   background: "#00274D",
    //   "& svg": {
    //     fill: "#FFFFFF",
    //   },
    // },
  },
};
export const menuItemIconStyles: any = {
  width: 20,
  minWidth: 20,
  height: 20,
  display: "flex",
  alignItems: "center",

  "& svg": {
    width: 20,
    height: 20,
    fill: "#00274D",
  },
};

export const menuItemTextStyles: any = {
  color: "#00274D",
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
  "&.active": {
    color: "#FFFFFF",
    ".menu-icon": {
      fill: "#FFFFFF",
    },
  },
  "& .menu-icon": {
    maxWidth: "20px",
    minWidth: "20px",
    height: "20px",
  },
  "&:hover, &:focus": {
    background: "#EAEAEA",
  },
};
