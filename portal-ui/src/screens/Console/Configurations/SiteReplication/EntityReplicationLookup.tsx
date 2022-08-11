// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 GuinsooLab.
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

import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import { ClustersIcon } from "../../../../icons";
import useApi from "../../Common/Hooks/useApi";
import { StatsResponseType } from "./SiteReplicationStatus";
import BucketEntityStatus from "./LookupStatus/BucketEntityStatus";
import Loader from "../../Common/Loader/Loader";
import PolicyEntityStatus from "./LookupStatus/PolicyEntityStatus";
import GroupEntityStatus from "./LookupStatus/GroupEntityStatus";
import UserEntityStatus from "./LookupStatus/UserEntityStatus";

const EntityReplicationLookup = () => {
  const [entityType, setEntityType] = useState<string>("bucket");
  const [entityValue, setEntityValue] = useState<string>("");

  const [stats, setStats] = useState<StatsResponseType>({});
  const [statsLoaded, setStatsLoaded] = useState<boolean>(false);

  const [isStatsLoading, invokeSiteStatsApi] = useApi(
    (res: any) => {
      setStats(res);
      setStatsLoaded(true);
    },
    (err: any) => {
      setStats({});
      setStatsLoaded(true);
    }
  );

  const {
    bucketStats = {},
    sites = {},
    userStats = {},
    policyStats = {},
    groupStats = {},
  } = stats || {};

  const getStats = (entityType: string = "", entityValue: string = "") => {
    setStatsLoaded(false);
    if (entityType && entityValue) {
      let url = `api/v1/admin/site-replication/status?buckets=false&entityType=${entityType}&entityValue=${entityValue}&groups=false&policies=false&users=false`;
      invokeSiteStatsApi("GET", url);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: {
            md: ".7fr .9fr 1.2fr .3fr",
            sm: "1.2fr .7fr .7fr .3fr",
            xs: "1fr",
          },
          gap: "15px",
        }}
      >
        <Box sx={{ width: "240px", flexGrow: "0" }}>
          View Replication Status for a:
        </Box>
        <Box
          sx={{
            marginLeft: {
              md: "-25px",
              xs: "0px",
            },
          }}
        >
          <SelectWrapper
            id="replicationEntityLookup"
            name="replicationEntityLookup"
            onChange={(e) => {
              setEntityType(e.target.value);
              setStatsLoaded(false);
            }}
            label=""
            value={entityType}
            options={[
              {
                label: "Bucket",
                value: "bucket",
              },
              {
                label: "User",
                value: "user",
              },
              {
                label: "Group",
                value: "group",
              },
              {
                label: "Policy",
                value: "policy",
              },
            ]}
            disabled={false}
          />
        </Box>

        <Box
          sx={{
            flex: 2,
          }}
        >
          <InputBoxWrapper
            id="replicationLookupEntityValue"
            name="replicationLookupEntityValue"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEntityValue(e.target.value);
              setStatsLoaded(false);
            }}
            placeholder={`test-${entityType}`}
            label=""
            value={entityValue}
          />
        </Box>
        <Box
          sx={{
            maxWidth: "80px",
          }}
        >
          <RBIconButton
            type={"button"}
            onClick={() => {
              getStats(entityType, entityValue);
            }}
            text={`View `}
            tooltip={"View across sites"}
            icon={<ClustersIcon />}
            color={"primary"}
            showLabelAlways
            disabled={!entityValue || !entityType}
          />
        </Box>
      </Box>

      {isStatsLoading ? (
        <Grid
          item
          xs={12}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          marginTop={"45px"}
        >
          <Loader style={{ width: 25, height: 25 }} />
        </Grid>
      ) : null}

      {statsLoaded ? (
        <Box>
          {!isStatsLoading && entityType === "bucket" && entityValue ? (
            <BucketEntityStatus
              bucketStats={bucketStats}
              sites={sites}
              lookupValue={entityValue}
            />
          ) : null}

          {!isStatsLoading && entityType === "user" && entityValue ? (
            <UserEntityStatus
              userStats={userStats}
              sites={sites}
              lookupValue={entityValue}
            />
          ) : null}

          {!isStatsLoading && entityType === "group" && entityValue ? (
            <GroupEntityStatus
              groupStats={groupStats}
              sites={sites}
              lookupValue={entityValue}
            />
          ) : null}

          {!isStatsLoading && entityType === "policy" && entityValue ? (
            <PolicyEntityStatus
              policyStats={policyStats}
              sites={sites}
              lookupValue={entityValue}
            />
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export default EntityReplicationLookup;
