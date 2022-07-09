// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { setUserName } from "./AddUsersSlice";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../store";

interface IAddUserProps2 {
  classes: any;
}

const UserSelector = ({ classes }: IAddUserProps2) => {
  const dispatch = useAppDispatch();
  const userName = useSelector((state: AppState) => state.createUser.userName);
  return (
    <Fragment>
      <InputBoxWrapper
        className={classes.spacerBottom}
        classes={{
          inputLabel: classes.sizedLabel,
        }}
        id="accesskey-input"
        name="accesskey-input"
        label="User Name"
        value={userName}
        autoFocus={true}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(setUserName(e.target.value));
        }}
      />
    </Fragment>
  );
};
export default UserSelector;
