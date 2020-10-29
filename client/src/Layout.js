import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "./Drawer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "row",
  },
}));

export default function Layout(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Drawer />
      {props.children}
    </div>
  );
}
