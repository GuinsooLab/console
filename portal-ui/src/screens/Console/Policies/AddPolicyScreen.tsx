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

import React, { Fragment, useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import AddPolicyHelpBox from "./AddPolicyHelpBox";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import BackLink from "../../../common/BackLink";
import { AddAccessRuleIcon } from "../../../icons";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../../src/common/api";
import FormLayout from "../Common/FormLayout";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";

const AddPolicyScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [policyName, setPolicyName] = useState<string>("");
  const [policyDefinition, setPolicyDefinition] = useState<string>("");

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("POST", "/api/v1/policies", {
        name: policyName,
        policy: policyDefinition,
      })
      .then((res) => {
        setAddLoading(false);
        navigate(`${IAM_PAGES.POLICIES}`);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        dispatch(setErrorSnackMessage(err));
      });
  };

  const resetForm = () => {
    setPolicyName("");
    setPolicyDefinition("");
  };

  const validatePolicyname = (policyName: string) => {
    if (policyName.indexOf(" ") !== -1) {
      return "Policy name cannot contain spaces";
    } else return "";
  };

  const validSave = policyName.trim() !== "" && policyName.indexOf(" ") === -1;

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader
          label={<BackLink to={IAM_PAGES.POLICIES} label={"Policies"} />}
        />
        <PageLayout>
          <FormLayout
            title={"Create Policy"}
            icon={<AddAccessRuleIcon />}
            helpbox={<AddPolicyHelpBox />}
          >
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                addRecord(e);
              }}
            >
              <Grid container item spacing={1}>
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="policy-name"
                    name="policy-name"
                    label="Policy Name"
                    autoFocus={true}
                    value={policyName}
                    error={validatePolicyname(policyName)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPolicyName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CodeMirrorWrapper
                    label={"Write Policy"}
                    value={policyDefinition}
                    onBeforeChange={(editor, data, value) => {
                      setPolicyDefinition(value);
                    }}
                    editorHeight={"350px"}
                  />
                </Grid>
                <Grid item xs={12} textAlign={"right"}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                      gap: "15px",
                    }}
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      onClick={resetForm}
                    >
                      Clear
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={addLoading || !validSave}
                    >
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </FormLayout>
        </PageLayout>
      </Grid>
    </Fragment>
  );
};

export default AddPolicyScreen;
