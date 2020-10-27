import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Registry from "./contracts/Registry.json";
import ShitCoin from "./contracts/ShitCoin.json";
import getWeb3 from "./getWeb3";
import MyContext from "./MyContext";
import BaseRouter from "./routes";

function App() {
  const context = useContext(MyContext);
  var state = context.state
  var setState = context.setState

  useEffect(() => {
    initWeb3();
    // eslint-disable-next-line
  }, []);

  async function initWeb3() {
    try {
      // Get network provider and web3 instance.
      let web3 = await getWeb3();
      console.log(web3)
      // await setState({...state, web3});
      // Use web3 to get the user's accounts.
      let accounts = await web3.eth.getAccounts();
      // await setState({...state, accounts});
      // context.setState({...context.state, accounts});
      // context.updateAccounts(accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      var deployedNetwork = Registry.networks[networkId];
      let registry = new web3.eth.Contract(
        Registry.abi,
        deployedNetwork && deployedNetwork.address
      );
      // context.updateRegistry(registry);
      console.log(registry)
      // context.setState({...context.state, registry});

      deployedNetwork = ShitCoin.networks[networkId];
      let shitcoin = new web3.eth.Contract(
        ShitCoin.abi,
        deployedNetwork && deployedNetwork.address
      );
      // context.updateShitcoin(shitcoin);
      // context.setState({...context.state, shitcoin});

      console.log(shitcoin._address);
      setState({...state, web3, accounts, shitcoin, registry})

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

  if (!state.web3) {
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
