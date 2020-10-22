const assert = require("assert");
const utils = require("./helpers/utils");
const Subscription = artifacts.require("Subscription");
const { ethers, Wallet } = require("ethers");
// const truffleAssert = require("truffle-assertions");

contract("Subscription", (accounts) => {
  let [alice, bob] = accounts;

  let contract;
  let bobSK
  let bobWallet
  beforeEach(async () => {
    contract = await Subscription.new();
    bobSK = "c98011a7325562556e5e476f2f8dc8db97558103dd4845ec41d573d9ba210f6a"
    bobWallet = new ethers.Wallet(new Buffer(bobSK, 'hex'))
  });

  afterEach(async () => {
    // await contract.kill();
  });

  xit("Should return subscription hash", async () => {
    var data = ["0x00"];

    var ethAddress = "0x0000000000000000000000000000000000000000";

    var meta = web3.eth.abi.encodeParameters(
      ["address", "uint256", "uint256", "uint256"],
      [bob, 1, 0, 1761264000]
    );

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
    );

    assert.strictEqual(
      "0xab0586a2c443d3d9dbe44aa0b8b033d38b34576aa2c1d475afbc09bc9cabf103",
      subscriptionHash
    );
  });

  it("Should create a new subscription", async () => {
    var data = ["0x00"];

    var ethAddress = "0x0000000000000000000000000000000000000000";

    var meta = web3.eth.abi.encodeParameters(
      ["address", "uint256", "uint256", "uint256"],
      [bob, 1, 0, 1761264000]
    );

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
    );

    var signedHash = await bobWallet.signMessage(ethers.utils.arrayify(subscriptionHash));

    var execSubscription = await contract.executeSubscription(
      bob, // recipient
      1, // value
      data, // bytes
      2, // operation
      0, // txGas
      0, // dataGas
      0, // gasPrice
      ethAddress, // gasToken
      meta, //bytes
      signedHash,
      {
        from: bob,
      }
    );

    assert.strictEqual(Boolean(execSubscription), true)

  });
});
