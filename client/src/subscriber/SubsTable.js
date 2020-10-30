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
import { signDaiPermit } from "eth-permit";
import { signPermit, domains } from "../utils/PermitToken.js";

export default function SubsTable() {
  const context = useContext(MyContext);
  const state = context.state;
  const setState = context.setState;
  const contracts = state.contracts;
  const coinDict = state.coinDict;
  const ShitCoin = state.shitcoin;
  const web3 = state.web3;
  const periodDict = state.periodDict;

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

    console.log("signing");
    var domain = domains["shitCoin"];

    domain.verifyingContract = coin;

    console.log(domain);

    var message = {
      holder: state.accounts[0],
      spender: contract.address,
      allowed: true,
      expiry: 0,
    };

    const res = await signPermit(window.ethereum, domain, message);

    message = res.message;

    const r = res.sig.slice(0, 66);
    const s = "0x" + res.sig.slice(66, 130);
    const v = parseInt(res.sig.slice(130, 132));

    const result = {
      nonce: message.nonce,
      expiry: message.expiry,
      v,
      r,
      s,
    };

    // const result = await signDaiPermit(
    //   window.ethereum,
    //   state.shitcoin._address,
    //   state.accounts[0],
    //   contract.address
    // );

    console.log(result);

    ShitCoin.methods
      .permit(
        state.accounts[0],
        contract.address,
        message.nonce,
        message.expiry,
        true,
        v,
        r,
        s
      )
      .send({ from: state.accounts[0] })
      .then((ress) => {
        console.log(ress);
      })
      .catch((err) => {
        console.log(err);
      });

    // axios.post(`http://localhost:8080/permit/`, {
    //   result,
    //   spender: contract.address,
    //   owner: state.accounts[0],
    //   coin,
    // });

    // const nonce = await ShitCoin.methods.nonces(state.accounts[0]).call();
    // const domain = await ShitCoin.methods.DOMAIN_SEPARATOR().call();
    // const PERMIT_TYPEHASH = await ShitCoin.methods.PERMIT_TYPEHASH().call();
    // console.log(domain);
    // console.log(PERMIT_TYPEHASH);

    // const firstEncode = web3.eth.abi.encodeParameters(
    //   ["bytes32", "address", "address", "uint256", "uint256", "bool"],
    //   [PERMIT_TYPEHASH, state.accounts[0], contract.address, nonce, 0, true]
    // );

    // console.log(firstEncode);

    // const tx = await ShitCoin.methods
    //   .permit(state.accounts[0], contract.address, nonce, 0, true)
    //   .send({ from: state.accounts[0] });

    // console.log(tx);

    // const logs = await web3.eth.getTransactionReceipt(tx.transactionHash);

    // console.log(logs);

    // await ShitCoin.methods
    //   .permit(
    //     state.accounts[0],
    //     contract.address,
    //     result.nonce,
    //     result.expiry,
    //     true,
    //     result.v,
    //     result.r,
    //     result.s
    //   )
    //   .send({ from: state.accounts[0] });

    // await ShitCoin.methods
    //   .approve(contract.address, -1)
    //   .send({ from: state.accounts[0] });

    return;

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

    axios.post(`http://localhost:8080/subscribe/`, {
      hash: signedHash,
      data: sendData,
      contract: contracts[i].address,
    });
  }

  const rowsPerPage = 5;

  return (
    <Paper>
      <Table>
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
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {contract.publisher}
                </TableCell>
                <TableCell>{contract.value}</TableCell>
                <TableCell>{periodDict[contract.period]}</TableCell>
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
      </Table>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={contracts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
      />
    </Paper>
  );
}
