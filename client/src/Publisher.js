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
import MyContext from "./MyContext";
import Subscription, { abi, bytecode } from "./contracts/Subscription.json";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: "50vw",
    justifyItems: "center",
    alignContent: "center",
    borderRadius: 50,
    borderColor: "#000",
    padding: 50,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default function Publisher() {
  const context = useContext(MyContext);
  const [formState, setFormState] = useState({
    coin: null,
    period: null,
    value: null,
  });
  const classes = useStyles();

  function handleChange(event) {
    setFormState({ ...formState, [event.target.name]: event.target.value });
    console.log(formState);
  }

  async function handleSubmit() {
    //   console.log("running")
    //   if (parseFloat(formState.value)){
    //     formState.value = context.web3.utils.BN(formState.value)
    //   }
    var decimals = await context.shitcoin.methods.decimals().call();
    let contract = new context.web3.eth.Contract(abi);
    let res = await contract
      .deploy({
        data: bytecode,
        arguments: [
          "0x67F7328a30DE1fa2C1fAD75f444CCE93C58C5aA8",
          context.accounts[0],
        ],
      })
      .send({ from: context.accounts[0] });
    console.log(res);
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={4}
            justify="center"
            className={classes.container}
          >
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel>Coin</InputLabel>
                <Select name="coin" onChange={handleChange}>
                  {context.shitcoin ? (
                    <MenuItem value={context.shitcoin._address}>
                      ShitCoin
                    </MenuItem>
                  ) : null}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <TextField
                  name="value"
                  label="amount"
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel>Period</InputLabel>
                <Select onChange={handleChange} name="period">
                  <MenuItem value={0}> Minute </MenuItem>
                  <MenuItem value={1}> Day </MenuItem>
                  <MenuItem value={2}> Week </MenuItem>
                  <MenuItem value={3}> Month </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.formControl}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Create
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
}
