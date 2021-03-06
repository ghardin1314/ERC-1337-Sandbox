import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";

import Registry from "./contracts/Registry.json";
import ShitCoin from "./contracts/ShitCoin.json";
import getWeb3 from "./getWeb3";
import MyContext from "./MyContext";
import BaseRouter from "./routes";
import Layout from "./Layout";

function App() {
  const context = useContext(MyContext);
  var state = context.state;
  var setState = context.setState;

  useEffect(() => {
    initWeb3();
    // eslint-disable-next-line
  }, []);

  async function initWeb3() {
    try {
      // Get network provider and web3 instance.
      let web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      let accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      if (networkId !== 5777) {
        alert("Contect to local host");
      }

      var deployedNetwork = ShitCoin.networks[networkId];
      let shitcoin = new web3.eth.Contract(
        ShitCoin.abi,
        deployedNetwork && deployedNetwork.address
      );

      shitcoin.events
        .Transfer({ fromBlock: 0 }, function (err, evt) {
          console.log(evt);
        })
        .on("data", (event) => {
          console.log(event);
        });

      var coinDict = state.coinDict;
      var periodDict = state.periodDict;

      coinDict[shitcoin._address] = "ShitCoin";
      periodDict[0] = "Minute";
      periodDict[1] = "Day";
      periodDict[2] = "Week";
      periodDict[3] = "Month";
      periodDict[4] = "Second";
      setState({ ...state, web3, accounts, shitcoin, coinDict });

      // window.ethereum.on("accountsChanged", async () => {
      //   console.log("accountchanged");
      //   var accounts = await web3.eth.getAccounts();
      //   setState({ ...state, accounts });
      // });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  if (!state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div>
      <Router>
        <CssBaseline />
        <Layout>
          <BaseRouter />
        </Layout>
      </Router>
    </div>
  );
}

export default App;
