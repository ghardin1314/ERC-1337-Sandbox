import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import React, { useContext, useState } from "react";
import MyContext from "../MyContext";
import Subscription, { abi, bytecode } from "../contracts/Subscription.json";
import ContractForm from "./contractForm";
import ContractsTable from "./ContractsTable";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    justify: "center",
    alignItems: "center",
  },
}));

export default function Publisher() {
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
          <ContractsTable />
        </Grid>
        <Grid item xs={8}>
          <ContractForm />
        </Grid>
      </Grid>
    </div>
  );
}
