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

import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import api from "../../../../common/api";
import {
  fieldBasic,
  modalStyleUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import CodeMirrorWrapper from "../../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../store";
import { getTenantAsync } from "../thunks/tenantDetailsAsync";
import SectionTitle from "../../Common/SectionTitle";

const styles = (theme: Theme) =>
  createStyles({
    errorState: {
      color: "#b53b4b",
      fontSize: 14,
      fontWeight: "bold",
    },
    codeMirrorContainer: {
      marginBottom: 20,
      paddingLeft: 15,
      "& label": {
        marginBottom: ".5rem",
      },
      "& label + div": {
        display: "none",
      },
    },
    ...modalStyleUtils,
    ...fieldBasic,
  });

interface ITenantYAML {
  yaml: string;
}

interface ITenantYAMLProps {
  classes: any;
}

const TenantYAML = ({ classes }: ITenantYAMLProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tenant = useSelector((state: AppState) => state.tenants.currentTenant);
  const namespace = useSelector(
    (state: AppState) => state.tenants.currentNamespace
  );

  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tenantYaml, setTenantYaml] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const updateTenant = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    setErrorMessage("");
    api
      .invoke("PUT", `/api/v1/namespaces/${namespace}/tenants/${tenant}/yaml`, {
        yaml: tenantYaml,
      })
      .then((res) => {
        setAddLoading(false);
        dispatch(getTenantAsync());
        setErrorMessage("");
        navigate(`/namespaces/${namespace}/tenants/${tenant}/summary`);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setErrorMessage(err.errorMessage);
      });
  };

  useEffect(() => {
    api
      .invoke("GET", `/api/v1/namespaces/${namespace}/tenants/${tenant}/yaml`)
      .then((res: ITenantYAML) => {
        setLoading(false);
        setTenantYaml(res.yaml);
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  }, [tenant, namespace, dispatch]);

  useEffect(() => {}, []);

  const validSave = tenantYaml.trim() !== "";

  return (
    <Fragment>
      {addLoading ||
        (loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        ))}
      {errorMessage !== "" && (
        <div className={classes.errorState}>{errorMessage}</div>
      )}

      {!loading && (
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            updateTenant(e);
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <SectionTitle>Tenant Specification</SectionTitle>
            </Grid>
            <Grid item xs={12} style={{ border: "1px solid #eaeaea" }}>
              <CodeMirrorWrapper
                value={tenantYaml}
                mode={"yaml"}
                onBeforeChange={(editor, data, value) => {
                  setTenantYaml(value);
                }}
                editorHeight={"550px"}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "right", paddingTop: 16 }}>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                disabled={addLoading}
                onClick={() => {
                  navigate(
                    `/namespaces/${namespace}/tenants/${tenant}/summary`
                  );
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={addLoading || !validSave}
                style={{ marginLeft: 8 }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Fragment>
  );
};

export default withStyles(styles)(TenantYAML);
