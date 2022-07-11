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

import React, { useEffect, useState } from "react";

import { DialogContentText } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { decodeURLString } from "../../../../../../common/utils";
import { ConfirmDeleteIcon } from "../../../../../../icons";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";

interface IDeleteNonCurrentProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedObject: string;
  selectedBucket: string;
}

const DeleteNonCurrentVersions = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  selectedObject,
}: IDeleteNonCurrentProps) => {
  const dispatch = useAppDispatch();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [typeConfirm, setTypeConfirm] = useState<string>("");

  useEffect(() => {
    if (deleteLoading) {
      api
        .invoke(
          "DELETE",
          `/api/v1/buckets/${selectedBucket}/objects?path=${selectedObject}&non_current_versions=true`
        )
        .then(() => {
          closeDeleteModalAndRefresh(true);
        })
        .catch((error: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(error));
          setDeleteLoading(false);
        });
    }
  }, [
    deleteLoading,
    closeDeleteModalAndRefresh,
    dispatch,
    selectedObject,
    selectedBucket,
  ]);

  if (!selectedObject) {
    return null;
  }
  const onConfirmDelete = () => {
    setDeleteLoading(true);
  };

  return (
    <ConfirmDialog
      title={`Delete Non-Current versions`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={() => closeDeleteModalAndRefresh(false)}
      confirmButtonProps={{
        disabled: typeConfirm !== "YES, PROCEED" || deleteLoading,
      }}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete all the non-current versions for:{" "}
          <b>{decodeURLString(selectedObject)}</b>? <br />
          <br />
          To continue please type <b>YES, PROCEED</b> in the box.
          <Grid item xs={12}>
            <InputBoxWrapper
              id="type-confirm"
              name="retype-tenant"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTypeConfirm(event.target.value);
              }}
              label=""
              value={typeConfirm}
            />
          </Grid>
        </DialogContentText>
      }
    />
  );
};

export default DeleteNonCurrentVersions;
