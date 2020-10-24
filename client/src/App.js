import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Registry from "./contracts/Registry.json";
import ShitCoin from "./contracts/ShitCoin.json";
import getWeb3 from "./getWeb3";
import MyContext from "./MyContext";
import BaseRouter from "./routes";

function App() {
  const context = useContext(MyContext);

  useEffect(() => {
    initWeb3();
  }, []);

  async function initWeb3() {
    try {
      // Get network provider and web3 instance.
      let web3 = await getWeb3();
      context.updateWeb3(web3);
      // Use web3 to get the user's accounts.
      let accounts = await web3.eth.getAccounts();
      context.updateAccounts(accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      var deployedNetwork = Registry.networks[networkId];
      let registry = new web3.eth.Contract(
        Registry.abi,
        deployedNetwork && deployedNetwork.address
      );
      context.updateRegistry(registry);

      deployedNetwork = ShitCoin.networks[networkId];
      let shitcoin = new web3.eth.Contract(
        ShitCoin.abi,
        deployedNetwork && deployedNetwork.address
      );
      context.updateShitcoin(shitcoin);

      console.log(shitcoin._address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  if (!context.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div>
      <Router>
        <BaseRouter />
      </Router>
    </div>
  );
}

export default App;
