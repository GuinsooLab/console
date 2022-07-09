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

import { useNavigate } from "react-router-dom";
import { DialogContentText } from "@mui/material";
import { ErrorResponseHandler } from "../../../common/types";
import useApi from "../Common/Hooks/useApi";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "../../../icons";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { encodeURLString } from "../../../common/utils";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

interface IDeleteUserStringProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  userName: string;
}

const DeleteUserModal = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  userName,
}: IDeleteUserStringProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onDelSuccess = () => {
    navigate(IAM_PAGES.USERS);
  };
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!userName) {
    return null;
  }

  const onConfirmDelete = () => {
    invokeDeleteApi(
      "DELETE",
      `/api/v1/user/${encodeURLString(userName)}`,
      null
    );
  };

  return (
    <ConfirmDialog
      title={`Delete User`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      titleIcon={<ConfirmDeleteIcon />}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete user <br />
          <b>{userName}</b>?
        </DialogContentText>
      }
    />
  );
};

export default DeleteUserModal;
