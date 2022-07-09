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

import React, { useCallback, useEffect, useState } from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import get from "lodash/get";
import Grid from "@mui/material/Grid";

import { stringSort } from "../../../utils/sortFunctions";
import { GroupsList } from "../Groups/types";
import {
  actionsTray,
  selectorsCommon,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SearchBox from "../Common/SearchBox";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IGroupsProps {
  classes: any;
  selectedGroups: string[];
  setSelectedGroups: any;
}

const styles = (theme: Theme) =>
  createStyles({
    noFound: {
      textAlign: "center",
      padding: "10px 0",
    },
    actionsTitle: {
      fontWeight: 400,
      color: "#000",
      fontSize: 14,
      alignSelf: "center",

      marginRight: 48,
      "@media (max-width: 900px)": {
        marginRight: 0,
      },
    },
    searchBox: {
      flex: 1,
      marginLeft: "2rem",
    },
    ...tableStyles,
    ...actionsTray,
    ...selectorsCommon,
  });

const GroupsSelectors = ({
  classes,
  selectedGroups,
  setSelectedGroups,
}: IGroupsProps) => {
  const dispatch = useAppDispatch();
  // Local State
  const [records, setRecords] = useState<any[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const fetchGroups = useCallback(() => {
    api
      .invoke("GET", `/api/v1/groups`)
      .then((res: GroupsList) => {
        let groups = get(res, "groups", []);

        if (!groups) {
          groups = [];
        }
        setRecords(groups.sort(stringSort));
        isLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setModalErrorSnackMessage(err));
        isLoading(false);
      });
  }, [dispatch]);

  //Effects
  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      fetchGroups();
    }
  }, [loading, fetchGroups]);

  const selGroups = !selectedGroups ? [] : selectedGroups;

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selGroups]; // We clone the selectedGroups array

    if (checked) {
      // If the user has checked this field we need to push this to selectedGroupsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedGroups(elements);

    return elements;
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter)
  );

  return (
    <React.Fragment>
      <Grid item xs={12}>
        {loading && <LinearProgress />}
        {records !== null && records.length > 0 ? (
          <React.Fragment>
            <Grid item xs={12} className={classes.actionsTray}>
              <label className={classes.actionsTitle}>Assign Groups</label>

              <div className={classes.searchBox}>
                <SearchBox
                  placeholder="Start typing to search for Groups"
                  adornmentPosition="end"
                  onChange={setFilter}
                  value={filter}
                />
              </div>
            </Grid>
            <Grid item xs={12} className={classes.tableBlock}>
              <TableWrapper
                columns={[{ label: "Group", elementKey: "" }]}
                onSelect={selectionChanged}
                selectedItems={selGroups}
                isLoading={loading}
                records={filteredRecords}
                entityName="Groups"
                idField=""
                customPaperHeight={classes.multiSelectTable}
              />
            </Grid>
          </React.Fragment>
        ) : (
          <div className={classes.noFound}>No Groups Available</div>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(GroupsSelectors);
