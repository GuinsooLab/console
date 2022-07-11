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

import React from "react";
import { Box, Grid } from "@mui/material";
import HelpBox from "../../../../common/HelpBox";

interface IDistributedOnly {
  iconComponent: any;
  entity: string;
}

const DistributedOnly = ({ iconComponent, entity }: IDistributedOnly) => {
  return (
    <Grid container alignItems={"center"}>
      <Grid item xs={12}>
        <HelpBox
          title={`${entity} not available`}
          iconComponent={iconComponent}
          help={
            <Box
              sx={{
                fontSize: "14px",
                display: "flex",
                border: "none",
                flexFlow: {
                  xs: "column",
                  md: "row",
                },
                "& a": {
                  color: (theme) => theme.colors.link,
                  textDecoration: "underline",
                },
              }}
            >
              <div>This feature is not available for a single-disk setup.</div>

              <div>
                Please deploy a server in{" "}
                <a
                  href="https://ciusji.gitbook.io/guinsoolab/products/data-storage/annastore/deployment-and-management/deploy-in-distributed-mode"
                  target="_blank"
                  rel="noreferrer"
                >
                  Distributed Mode
                </a>{" "}
                to use this feature.
              </div>
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default DistributedOnly;
