import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

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

export default function ContractsTable() {
  const context = useContext(MyContext);
  const state = context.state;
  const setState = context.setState;
  const contracts = state.contracts;
  const coinDict = state.coinDict;

  const [page, setPage] = useState(0);

  useEffect(() => {
    populateContracts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    populateContracts();
  }, [state.accounts]);

  async function populateContracts() {
    axios
      .get(
        `http://localhost:8080/publishers/${context.state.accounts[0]}/contracts/`,
        {
          params: { publisher_address: context.state.accounts[0] },
        }
      )
      .then(async (res) => {
        var myContracts = res.data;
        let sub;
        let instance;
        let activeSubs;
        let periodValue;

        // Check all this

        for (var i = 0; i < myContracts.length; i++) {
          activeSubs = 0;
          periodValue = 0;
          instance = new state.web3.eth.Contract(abi, myContracts[i].address);
          //   console.log(instance);
          myContracts[i].totalSubs =
            (await instance.methods.getSubscriberListLength().call()) - 1;
          myContracts[
            i
          ].period = await instance.methods.acceptedPeriods().call();
          myContracts[i].coin = await instance.methods.acceptedCoins().call();
          for (var j = 1; j < myContracts[i].totalSubs + 1; j++) {
            sub = await instance.methods.SubscriptionList(j).call();
            if (sub.status === "0") {
              activeSubs++;
              periodValue = periodValue + parseFloat(sub.value);
            }
          }
          myContracts[i].activeSubs = activeSubs;
          myContracts[i].periodValue = periodValue;
        }

        setState({ ...state, contracts: myContracts });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const rowsPerPage = 5;

  return (
    <React.Fragment>
      <Table>
        <TableContainer component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Income per period</TableCell>
              <TableCell>Period Length</TableCell>
              <TableCell>Income Coin</TableCell>
              <TableCell>Active Subscribers</TableCell>
              <TableCell>Total Subscribers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contract) => (
                <TableRow key={contract.address}>
                  <TableCell>{contract.address}</TableCell>
                  <TableCell>{contract.periodValue}</TableCell>
                  <TableCell>{contract.period}</TableCell>
                  <TableCell>{coinDict[contract.coin]}</TableCell>
                  <TableCell>{contract.activeSubs}</TableCell>
                  <TableCell>{contract.totalSubs}</TableCell>
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
    </React.Fragment>
  );
}
