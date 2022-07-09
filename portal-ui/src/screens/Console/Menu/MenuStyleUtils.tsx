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
  paddingBottom: "18px",
  "&.active div:nth-of-type(1)": {
    border: "2px solid #ffffff",
  },
  "&:hover, &:focus": {
    background: "none",
    "& div:nth-of-type(1)": {
      background: "none",
      "& svg": {
        fill: "#ffffff",
      },
    },
  },
};
export const menuItemIconStyles: any = {
  width: 37,
  minWidth: 37,
  height: 37,
  background: "#00274D",
  border: "2px solid #002148",
  display: "flex",
  alignItems: "center",
  borderRadius: "50%",
  justifyContent: "center",

  "& svg": {
    width: 16,
    height: 16,
    fill: "#8399AB",
  },
};

export const menuItemTextStyles: any = {
  color: "#BCC7D1",
  fontSize: "14px",
  marginLeft: "11px",
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

  "&.bottom-menu-item": {
    marginBottom: "5px",
  },
};

export const menuItemStyle: any = {
  paddingLeft: "8px",
  paddingRight: "5px",
  paddingBottom: "8px",
  borderRadius: "2px",
  marginTop: "2px",
  "&.active": {
    backgroundColor: "hsla(0,0%,100%,.1)",
    ".menu-icon": {
      border: "1px solid hsla(0,0%,100%,.1)",
      borderRadius: "50%",
      background: "#072549",
    },
  },
  "& .menu-icon": {
    padding: "5px",
    maxWidth: "28px",
    minWidth: "28px",
    height: "28px",
    background: "none",
  },
  "&:hover, &:focus": {
    background: "hsla(0,0%,100%,.25)",
    "& .menu-icon": {
      background: "#072549",
      borderRadius: "50%",
      "& svg": {
        fill: "#c7c3c3",
      },
    },
  },
};
