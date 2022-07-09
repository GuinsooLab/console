import React, { Fragment, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, Grid } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import CheckboxWrapper from "../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import {
  actionsTray,
  containerForHeader,
  inlineCheckboxes,
} from "../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      marginTop: 24,
      textAlign: "right",
      "& .MuiButton-root": {
        marginLeft: 8,
      },
    },
    dropdown: {
      marginBottom: 24,
    },
    checkboxLabel: {
      marginTop: 12,
      marginRight: 4,
      fontSize: 16,
      fontWeight: 500,
    },
    checkboxDisabled: {
      opacity: 0.5,
    },
    inlineCheckboxes: {
      ...inlineCheckboxes.inlineCheckboxes,
      alignItems: "center",

      "@media (max-width: 900px)": {
        flexFlow: "column",
        alignItems: "flex-start",
      },
    },
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
  });

interface IProfileProps {
  classes: any;
}

const Profile = ({ classes }: IProfileProps) => {
  const [profilingStarted, setProfilingStarted] = useState<boolean>(false);
  const [types, setTypes] = useState<string[]>([
    "cpu",
    "mem",
    "block",
    "mutex",
    "trace",
    "threads",
    "goroutines",
  ]);

  const typesList = [
    { label: "cpu", value: "cpu" },
    { label: "mem", value: "mem" },
    { label: "block", value: "block" },
    { label: "mutex", value: "mutex" },
    { label: "trace", value: "trace" },
    { label: "threads", value: "threads" },
    { label: "goroutines", value: "goroutines" },
  ];

  const onCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newArr: string[] = [];
    if (types.indexOf(e.target.value) > -1) {
      newArr = types.filter((type) => type !== e.target.value);
    } else {
      newArr = [...types, e.target.value];
    }
    setTypes(newArr);
  };

  const startProfiling = () => {
    if (!profilingStarted) {
      const typeString = types.join(",");
      setProfilingStarted(true);
      api
        .invoke("POST", `/api/v1/profiling/start`, {
          type: typeString,
        })
        .then(() => {})
        .catch((err: ErrorResponseHandler) => {
          console.log(err);
          setProfilingStarted(false);
        });
    }
  };

  const stopProfiling = () => {
    if (profilingStarted) {
      const anchor = document.createElement("a");
      document.body.appendChild(anchor);
      let path = "/api/v1/profiling/stop";
      var req = new XMLHttpRequest();
      req.open("POST", path, true);
      req.responseType = "blob";
      req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200) {
          let filename = "profile.zip";
          setProfilingStarted(false);
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(req.response);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
      req.send();
    }
  };

  return (
    <Fragment>
      <PageHeader label="Profile" />
      <PageLayout>
        <Grid item xs={12} className={classes.boxy}>
          <Grid item xs={12} className={classes.dropdown}>
            <Grid
              item
              xs={12}
              className={`${classes.inlineCheckboxes} ${
                profilingStarted && classes.checkboxDisabled
              }`}
            >
              <div className={classes.checkboxLabel}>Types to profile:</div>
              {typesList.map((t) => (
                <CheckboxWrapper
                  checked={types.indexOf(t.value) > -1}
                  disabled={profilingStarted}
                  key={`checkbox-${t.label}`}
                  id={`checkbox-${t.label}`}
                  label={t.label}
                  name={`checkbox-${t.label}`}
                  onChange={onCheckboxClick}
                  value={t.value}
                />
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={profilingStarted || types.length < 1}
              onClick={() => {
                startProfiling();
              }}
            >
              Start Profiling
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!profilingStarted}
              onClick={() => {
                stopProfiling();
              }}
            >
              Stop Profiling
            </Button>
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(Profile);
