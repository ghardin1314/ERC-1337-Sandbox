import React, { useContext, useState, useEffect } from "react";

import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MyContext from "../MyContext";
import axios from "axios";

import Subscription, { abi, bytecode } from "../contracts/Subscription.json";

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
  item: {
    spacing: 2,
  },
}));

export default function ContractForm() {
  const context = useContext(MyContext);
  const state = context.state;
  const setState = context.setState;
  const shitcoin = context.state.shitcoin;
  const classes = useStyles();
  const [formState, setFormState] = useState({
    coin: null,
    period: null,
    value: null,
  });

  function handleChange(event) {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  }

  async function handleSubmit() {
    var decimals = await shitcoin.methods.decimals().call();
    let contract = new context.state.web3.eth.Contract(abi, {
      from: state.accounts[0],
    });
    try {
      let res = await contract
        .deploy({
          data: bytecode,
          arguments: [
            "0x67F7328a30DE1fa2C1fAD75f444CCE93C58C5aA8",
            context.state.accounts[0],
            formState.coin,
            parseInt(formState.period),
            parseInt(formState.value),
          ],
        })
        .send({ from: context.state.accounts[0] });

      console.log(res);

      axios
        .post("http://localhost:8080/contracts", {
          address: res._address,
          publisher: context.state.accounts[0],
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      alert("Issue deploying contract. Try resetting your MetaMask account");
    }
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={4}
          justify="center"
          className={classes.container}
        >
          <Grid item xs={3}>
            <FormControl className={classes.formControl}>
              <InputLabel>Coin</InputLabel>
              <Select name="coin" onChange={handleChange}>
                {shitcoin ? (
                  <MenuItem value={shitcoin._address}>ShitCoin</MenuItem>
                ) : null}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl className={classes.formControl}>
              <TextField name="value" label="amount" onChange={handleChange} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl className={classes.formControl}>
              <InputLabel>Period</InputLabel>
              <Select onChange={handleChange} name="period">
                <MenuItem value={0}> Minute </MenuItem>
                <MenuItem value={1}> Day </MenuItem>
                <MenuItem value={2}> Week </MenuItem>
                <MenuItem value={3}> Month </MenuItem>
                <MenuItem value={4}> Second </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
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
      </Paper>
    </div>
  );
}
