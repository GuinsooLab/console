// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 GuinsooLab, Inc.
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

import React from "react";
import { Box } from "@mui/material";

type LabelWithIconProps = {
  icon: React.ReactNode | null;
  label: React.ReactNode | null;
};

const LabelWithIcon = ({ icon = null, label = null }: LabelWithIconProps) => {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <div
        style={{
          height: 16,
          width: 16,
          display: "flex",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        {icon}
      </div>
      <div style={{ marginLeft: icon ? 5 : "none" }}>{label}</div>
    </Box>
  );
};

export default LabelWithIcon;
