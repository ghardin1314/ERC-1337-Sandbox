import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";

import MyContext from "../MyContext";
import Subscription, { abi, bytecode } from "../contracts/Subscription.json";

export default function SubsTable() {
  const context = useContext(MyContext);
  const state = context.state;
  const setState = context.setState;
  const contracts = state.contracts;
  const coinDict = state.coinDict;
  const ShitCoin = state.shitcoin;
  const web3 = state.web3;

  const [page, setPage] = useState(0);

  useEffect(() => {
    context.setState({ ...state, contracts: [] });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    populateContracts();
    // eslint-disable-next-line
  }, [state.contracts]);

  async function populateContracts() {
    axios
      .get(`http://localhost:8080/contracts/`)
      .then(async (res) => {
        let contracts = res.data;

        let instance;

        // Check all this

        for (var i = 0; i < contracts.length; i++) {
          instance = new state.web3.eth.Contract(abi, contracts[i].address);
          //   console.log(instance);
          contracts[i].publisher = await instance.methods._publisher().call();
          contracts[i].period = await instance.methods.acceptedPeriods().call();
          contracts[i].coin = await instance.methods.acceptedCoins().call();
          contracts[i].value = await instance.methods.acceptedValues().call();
        }

        setState({ ...state, contracts });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  async function handleSubscribe(i) {
    var contract = contracts[i];
    var coin = contract.coin;
    // await ShitCoin.methods
    //   .approve(contract.address, -1)
    //   .send({ from: state.accounts[0] });

    var ethAddress = "0x0000000000000000000000000000000000000000";

    var meta = web3.eth.abi.encodeParameters(
      ["address", "uint256"],
      [state.accounts[0], 1]
    );

    var data = web3.eth.abi.encodeParameters(["address"], [coin]);

    var instance = new state.web3.eth.Contract(abi, contracts[i].address);
    var hash = await instance.methods
      .getSubscriptionHash(
        state.accounts[0],
        contract.value,
        data,
        2,
        0,
        0,
        0,
        ethAddress,
        meta
      )
      .call();

    var signedHash = await web3.eth.personal.sign(hash, state.accounts[0]);

    var sendData = [
      state.accounts[0],
      contract.value,
      data,
      2,
      0,
      0,
      0,
      ethAddress,
      meta,
    ];

    // var execSubscription = await instance.methods
    //   .executeSubscription(
    //     state.accounts[0],
    //     contract.value,
    //     data, // bytes
    //     2, // operation
    //     0, // txGas
    //     0, // dataGas
    //     0, // gasPrice
    //     ethAddress, // gasToken
    //     meta, //bytes
    //     signedHash
    //   )
    //   .send({ from: state.accounts[0] });

    axios.post(`http://localhost:8080/subscribe/`, {
      hash: signedHash,
      data: sendData,
      contract: contracts[i].address
    });
  }

  const rowsPerPage = 5;

  return (
    <td>
      <Table>
        <TableContainer component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Publisher</TableCell>
              <TableCell>Cost per Period</TableCell>
              <TableCell>Period Length</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contract, i) => (
                <TableRow key={contract.publisher}>
                  <TableCell>{contract.publisher}</TableCell>
                  <TableCell>{contract.value}</TableCell>
                  <TableCell>{contract.period}</TableCell>
                  <TableCell>{coinDict[contract.coin]}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleSubscribe(i)}
                    >
                      Subscribe
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableContainer>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={contracts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
      />
    </td>
  );
}
