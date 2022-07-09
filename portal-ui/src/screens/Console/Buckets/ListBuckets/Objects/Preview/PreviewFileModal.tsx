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

import React, { Fragment } from "react";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import PreviewFileContent from "./PreviewFileContent";
import { BucketObjectItem } from "../ListObjects/types";
import { ObjectPreviewIcon } from "../../../../../../icons";

interface IPreviewFileProps {
  open: boolean;
  bucketName: string;
  object: BucketObjectItem | null;
  onClosePreview: () => void;
}

const PreviewFileModal = ({
  open,
  bucketName,
  object,
  onClosePreview,
}: IPreviewFileProps) => {
  return (
    <Fragment>
      <ModalWrapper
        modalOpen={open}
        title={`Preview - ${object?.name}`}
        onClose={onClosePreview}
        wideLimit={false}
        titleIcon={<ObjectPreviewIcon />}
      >
        <PreviewFileContent bucketName={bucketName} object={object} />
      </ModalWrapper>
    </Fragment>
  );
};

export default PreviewFileModal;
