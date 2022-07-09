// This file is part of GuinsooLab Console Server
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

import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import Grid from "@mui/material/Grid";
import withStyles from "@mui/styles/withStyles";
import createStyles from "@mui/styles/createStyles";
import { Theme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton, Tooltip } from "@mui/material";
import { objectBrowserCommon } from "../Common/FormComponents/common/styleLibrary";
import { encodeURLString } from "../../../common/utils";
import { BackCaretIcon, CopyIcon, NewPathIcon } from "../../../icons";
import { hasPermission } from "../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../common/SecureComponent/permissions";
import { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";
import withSuspense from "../Common/Components/withSuspense";
import { setSnackBarMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setVersionsModeEnabled } from "./objectBrowserSlice";
import RBIconButton from "../Buckets/BucketDetails/SummaryItems/RBIconButton";

const CreatePathModal = withSuspense(
  React.lazy(
    () => import("../Buckets/ListBuckets/Objects/ListObjects/CreatePathModal")
  )
);

const styles = (theme: Theme) =>
  createStyles({
    ...objectBrowserCommon,
    slashSpacingStyle: {
      margin: "0 5px",
    },
  });

interface IObjectBrowser {
  classes: any;
  bucketName: string;
  internalPaths: string;
  hidePathButton?: boolean;
  existingFiles: BucketObjectItem[];
  additionalOptions?: React.ReactNode;
}

const BrowserBreadcrumbs = ({
  classes,
  bucketName,
  internalPaths,
  existingFiles,
  hidePathButton,
  additionalOptions,
}: IObjectBrowser) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode
  );
  const versionedFile = useSelector(
    (state: AppState) => state.objectBrowser.versionedFile
  );

  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);

  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = paths.split("/").filter((path) => path !== "");
  const lastBreadcrumbsIndex = splitPaths.length - 1;

  let breadcrumbsMap = splitPaths.map((objectItem: string, index: number) => {
    const subSplit = `${splitPaths.slice(0, index + 1).join("/")}/`;
    const route = `/buckets/${bucketName}/browse/${
      subSplit ? `${encodeURLString(subSplit)}` : ``
    }`;

    if (index === lastBreadcrumbsIndex && objectItem === versionedFile) {
      return null;
    }

    return (
      <Fragment key={`breadcrumbs-${index.toString()}`}>
        <span className={classes.slashSpacingStyle}>/</span>
        {index === lastBreadcrumbsIndex ? (
          <span style={{ cursor: "default" }}>{objectItem}</span>
        ) : (
          <Link
            to={route}
            onClick={() => {
              dispatch(
                setVersionsModeEnabled({ status: false, objectName: "" })
              );
            }}
          >
            {objectItem}
          </Link>
        )}
      </Fragment>
    );
  });

  let versionsItem: any[] = [];

  if (versionsMode) {
    versionsItem = [
      <Fragment key={`breadcrumbs-versionedItem`}>
        <span>
          <span className={classes.slashSpacingStyle}>/</span>
          {versionedFile} - Versions
        </span>
      </Fragment>,
    ];
  }

  const listBreadcrumbs: any[] = [
    <Fragment key={`breadcrumbs-root-path`}>
      <Link
        to={`/buckets/${bucketName}/browse`}
        onClick={() => {
          dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
        }}
      >
        {bucketName}
      </Link>
    </Fragment>,
    ...breadcrumbsMap,
    ...versionsItem,
  ];

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  const goBackFunction = () => {
    if (versionsMode) {
      dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
    } else {
      navigate(-1);
    }
  };

  return (
    <Fragment>
      <div className={classes.breadcrumbsMain}>
        {createFolderOpen && (
          <CreatePathModal
            modalOpen={createFolderOpen}
            bucketName={bucketName}
            folderName={internalPaths}
            onClose={closeAddFolderModal}
            existingFiles={existingFiles}
          />
        )}
        <Grid item xs={12} className={`${classes.breadcrumbs}`}>
          <IconButton
            onClick={goBackFunction}
            sx={{
              border: "#EAEDEE 1px solid",
              backgroundColor: "#fff",
              borderLeft: 0,
              borderRadius: 0,
              width: 38,
              height: 38,
              marginRight: "10px",
            }}
          >
            <BackCaretIcon />
          </IconButton>
          <div className={classes.breadcrumbsList} dir="rtl">
            {listBreadcrumbs}
          </div>
          <CopyToClipboard text={`${bucketName}/${splitPaths.join("/")}`}>
            <RBIconButton
              id={"copy-path"}
              icon={<CopyIcon />}
              disableTouchRipple
              disableRipple
              focusRipple={false}
              variant={"outlined"}
              onClick={() => {
                dispatch(setSnackBarMessage("Path copied to clipboard"));
              }}
              sx={{
                marginRight: "3px",
                padding: "0",
                color: "#969FA8",
                border: "#969FA8 1px solid",
                width: "28px",
                height: "28px",

                "& .MuiButton-root": {
                  height: "28px",
                },
                "& .min-icon": {
                  width: "12px",
                  height: "12px",
                },
              }}
            />
          </CopyToClipboard>
          <div className={classes.additionalOptions}>{additionalOptions}</div>
        </Grid>
        {!hidePathButton && (
          <Tooltip title={"Choose or create a new path"}>
            <Button
              id={"new-path"}
              onClick={() => {
                setCreateFolderOpen(true);
              }}
              disabled={
                rewindEnabled ||
                !hasPermission(bucketName, [IAM_SCOPES.S3_PUT_OBJECT])
              }
              endIcon={<NewPathIcon />}
              disableTouchRipple
              disableRipple
              focusRipple={false}
              sx={{
                color: "#969FA8",
                border: "#969FA8 1px solid",
                whiteSpace: "nowrap",
                minWidth: "160px",
                "@media (max-width: 1060px)": {
                  fontSize: 0,
                  minWidth: 40,
                  padding: "0 10px 0 0",
                },
              }}
              variant={"outlined"}
            >
              Create new path
            </Button>
          </Tooltip>
        )}
      </div>
      <div className={classes.breadcrumbsSecond}>{additionalOptions}</div>
    </Fragment>
  );
};

export default withStyles(styles)(BrowserBreadcrumbs);
