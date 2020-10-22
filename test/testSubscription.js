const assert = require("assert");
const utils = require("./helpers/utils");
const Subscription = artifacts.require("Subscription");
// const truffleAssert = require("truffle-assertions");


contract("Subscription", (accounts) => {
  let [alice, bob] = accounts;

  let contract;
  beforeEach(async () => {
    contract = await Subscription.new();
  });

  afterEach(async () => {
    // await contract.kill();
  });

  it("Should return subscription hash", async () => {

    var data = ['0x00']

    var ethAddress = "0x0000000000000000000000000000000000000000"

    var meta = [web3.utils.toHex(bob), web3.utils.numberToHex(1)]

    console.log(meta)

    // meta = web3.utils.bytesToHex(meta)

    var subscriptionHash = await contract.getSubscriptionHash(
        bob, // recipient
        1, // value
        data, // bytes
        2, // operation
        0, // txGas
        0, // dataGas
        0, // gasPrice
        ethAddress, // gasToken
        meta //bytes
    )

    assert.strictEqual("0x3a23861cbbf42679aa6c73df1f8c0cd868cb0a58f0def585a7b4c07b3fcadad4", subscriptionHash)

  })

});
