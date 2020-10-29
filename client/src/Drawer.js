import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PaymentIcon from "@material-ui/icons/Payment";
import Icon from "@material-ui/core/Icon";
import EthIcon from "./img/ethereum.svg";

import MyContext from "./MyContext";
import axios from "axios";

const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
}));

export default function MyDrawer() {
  const classes = useStyles();
  const context = useContext(MyContext);
  var state = context.state;
  var setState = context.setState;
  const web3 = state.web3;
  const shitcoin = state.shitcoin;

  const [coinbal, setCoinBal] = useState(0);
  const [ethbal, setEthBal] = useState(0);

  function updateAccounts(accounts) {
    setState({ ...state, accounts });
  }

  async function getBalances() {
    setInterval(async () => {
      var accounts = await web3.eth.getAccounts();
      var coinbal = await shitcoin.methods.balanceOf(accounts[0]).call();
      setCoinBal(coinbal);
      var ethbal = await web3.eth.getBalance(accounts[0]);
      ethbal = parseFloat(web3.utils.fromWei(web3.utils.toBN(ethbal)));
      setEthBal(ethbal.toFixed(2));
      if (accounts[0] !== state.accounts[0]){
        console.log("different")
        state.accounts = accounts
        setState(state)
      }
    }, 1000);
  }

  function mintTokens() {
    axios.post("http://localhost:8080/mint", {
      account: state.accounts[0],
      coin: shitcoin._address,
    });
    // shitcoin.methods
    //   .mintTokens(state.accounts[0])
    //   .send({ from: state.accounts[0] });
  }

  useEffect(() => {
    getBalances();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid container className={classes.container} spacing={4}>
          <Grid item>
            <Button component={Link} to="/" color="primary" variant="contained">
              <HomeIcon />
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={mintTokens} color="primary" variant="contained">
              <PaymentIcon />
            </Button>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <AttachMoneyIcon />
              <Typography>{coinbal}</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <Icon>
                  <img src={EthIcon} height={25} width={25} alt="" />
                </Icon>
              </Grid>
              <Grid item>
                <Typography>{ethbal}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
    </div>
  );
}
