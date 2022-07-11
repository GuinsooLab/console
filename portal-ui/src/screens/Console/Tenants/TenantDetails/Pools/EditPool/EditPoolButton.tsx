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

import { Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../../../../store";
import { editPoolAsync } from "./thunks/editPoolAsync";

const EditPoolButton = () => {
  const dispatch = useAppDispatch();
  const requiredPages = ["setup", "affinity", "configure"];

  const selectedStorageClass = useSelector(
    (state: AppState) => state.editPool.fields.setup.storageClass
  );
  const validPages = useSelector(
    (state: AppState) => state.editPool.validPages
  );

  const editSending = useSelector(
    (state: AppState) => state.editPool.editSending
  );

  const enabled =
    !editSending &&
    selectedStorageClass !== "" &&
    requiredPages.every((v) => validPages.includes(v));

  return (
    <Button
      id={"wizard-button-Update"}
      variant="contained"
      color="primary"
      size="small"
      onClick={() => {
        dispatch(editPoolAsync());
      }}
      disabled={!enabled}
      key={`button-EditPool-Update`}
    >
      Update
    </Button>
  );
};

export default EditPoolButton;
