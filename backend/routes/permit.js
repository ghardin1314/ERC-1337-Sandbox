var express = require("express");
var router = express.Router();
const Web3 = require("web3");
const fs = require("fs");
require("dotenv").config();

const ShitCoin = require("../../client/src/contracts/ShitCoin.json");

const address = process.env.ACCOUNT;
const privateKey = process.env.PRIVATE_KEY;
var instance = null;

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.net
  .getId()
  .then((res) => {
    const networkId = res;
    const deployedNetwork = ShitCoin.networks[networkId];
    instance = new web3.eth.Contract(
      ShitCoin.abi,
      deployedNetwork && deployedNetwork.address
    );
  })
  .catch(console.log);

router.route("/").post(async (req, res) => {
  const result = req.body.result;
  const spender = req.body.spender;
  const owner = req.body.owner;
  const tx = instance.methods.permit(
    owner,
    spender,
    result.nonce,
    result.expiry,
    true,
    result.v,
    result.r,
    result.s
  );
  const gas = await tx.estimateGas({ from: address });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(address, "pending");

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: instance._address,
      from: address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: 5777,
    },
    privateKey
  );

  console.log(
    `Old approval: ${await instance.methods.allowance(owner, spender).call()}`
  );
  await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(
    `New approval: ${await instance.methods.allowance(owner, spender).call()}`
  );
});

module.exports = router;
