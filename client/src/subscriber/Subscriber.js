import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import SubsTable from "./SubsTable";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    height: "100vh",
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    justify: "center",
    alignItems: "center",
    margin: 16,
  },
}));

export default function Subscriber() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
        className={classes.container}
      >
        <Grid item xs={10}>
          <SubsTable />
        </Grid>
      </Grid>
    </div>
  );
}
