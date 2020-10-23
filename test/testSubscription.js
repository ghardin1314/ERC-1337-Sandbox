const assert = require("assert");
const utils = require("./helpers/utils");
const Subscription = artifacts.require("Subscription");
const ShitCoin = artifacts.require("ShitCoin");
const { ethers, Wallet } = require("ethers");
const { debug } = require("console");
// const truffleAssert = require("truffle-assertions");

contract("Subscription", (accounts) => {
  let [alice, bob] = accounts;

  let contract;
  let coin;
  let bobSK;
  let bobWallet;
  let data;
  beforeEach(async () => {
    contract = await Subscription.new(alice, alice);
    coin = await ShitCoin.new();
    await coin.mintTokens(bob);
    bobSK = "c98011a7325562556e5e476f2f8dc8db97558103dd4845ec41d573d9ba210f6a";
    bobWallet = new ethers.Wallet(new Buffer(bobSK, "hex"));
    data = web3.eth.abi.encodeParameters(["address"], [coin.address]);
  });

  afterEach(async () => {
    // await contract.kill();
  });

  xcontext("With creating a new subscription", async () => {
    xit("Should return subscription hash", async () => {
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
        "0x824a3a3cde05d5d236f30fad1a16aaf6e063a09bf7ed62cd3428afacfc341856",
        subscriptionHash
      );
    });

    it("Should create a new subscription", async () => {
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

      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

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

      assert.strictEqual(Boolean(execSubscription), true);
    });
  });

  xcontext("With checking for valid subscriptions", async () => {
    it("Should return true for a valid subscription", async () => {
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

      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

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

      var isValidSubscription = await contract.isValidSubscription.call(
        subscriptionHash
      );

      assert.strictEqual(Boolean(isValidSubscription), true);
    });

    it("Should return false for an invalid subscription", async () => {
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

      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

      // subscription is not executed

      var isValidSubscription = await contract.isValidSubscription.call(
        subscriptionHash
      );

      assert.strictEqual(Boolean(isValidSubscription), false);
    });
  });

  xcontext("With checking subscription status", async () => {
    it("Should return active for an active subscription", async () => {
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

      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

      // subscription is executed
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

      var subscriptionStatus = await contract.getSubscriptionStatus(
        subscriptionHash
      );

      assert.strictEqual(parseInt(subscriptionStatus[0]), 0);
    });
  });

  xcontext("With modifying subscription status", async () => {
    xit("Should return modify status hash", async () => {
      var ethAddress = "0x0000000000000000000000000000000000000000";

      var meta = web3.eth.abi.encodeParameters(
        ["address", "uint256", "uint256", "uint256"],
        [bob, 1, 0, 1761264000]
      );

      // Get subscription hash
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

      // Sign Hash
      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

      // Initiate Subscription
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
      // Get hash to modify status to canceled
      var modifyStatusHash = await contract.getModifyStatusHash(
        subscriptionHash,
        3
      );

      assert.strictEqual(
        "+0x127c345b9edd7842d06f0dd4348cd7e9ea85af94f795ca67756a7bf2732b4157",
        modifyStatusHash
      );
    });

    it("Should modify status of subscription to canceled", async () => {
      var ethAddress = "0x0000000000000000000000000000000000000000";

      var meta = web3.eth.abi.encodeParameters(
        ["address", "uint256", "uint256", "uint256"],
        [bob, 1, 0, 1761264000]
      );

      // Get subscription hash
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

      // Sign Hash
      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

      // Initiate Subscription
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
      // Get hash to modify status to canceled
      var modifyStatusHash = await contract.getModifyStatusHash(
        subscriptionHash,
        3
      );

      var signedModifiedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(modifyStatusHash)
      );

      var modifyStatus = await contract.modifyStatus(
        subscriptionHash,
        3,
        signedModifiedHash
      );

      assert.strictEqual(Boolean(modifyStatus), true);

      var subscriptionStatus = await contract.getSubscriptionStatus(
        modifyStatusHash
      );

      assert.strictEqual(parseInt(subscriptionStatus[0]), 3);
    });
  });

  context("With executing subscriptions", async () => {
    it("Should transfer funds when called", async () => {
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

      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

      // initiate subscription
      await contract.executeSubscription(
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

      // approve ERC20 transfer

      await coin.approve(contract.address, 10, { from: bob });

      // call subscription
      var execSubscription = await contract.executeSubscription(
        bob, // recipient
        1, // value
        data, // bytes
        0, // operation: call
        0, // txGas
        0, // dataGas
        0, // gasPrice
        ethAddress, // gasToken
        meta, //bytes
        signedHash
      );

      assert.strictEqual(parseInt(await coin.balanceOf(alice)), 1);
    });

    it("Should fail when called before next withdraw", async () => {
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

      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

      // initiate subscription
      await contract.executeSubscription(
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

      // approve ERC20 transfer

      await coin.approve(contract.address, 10, { from: bob });

      // call subscription
      var execSubscription = await contract.executeSubscription(
        bob, // recipient
        1, // value
        data, // bytes
        0, // operation: call
        0, // txGas
        0, // dataGas
        0, // gasPrice
        ethAddress, // gasToken
        meta, //bytes
        signedHash
      );

      var failedSubscription = await contract.executeSubscription(
        bob, // recipient
        1, // value
        data, // bytes
        0, // operation: call
        0, // txGas
        0, // dataGas
        0, // gasPrice
        ethAddress, // gasToken
        meta, //bytes
        signedHash
      );

      assert.strictEqual(parseInt(await coin.balanceOf(alice)), 1);

    });

    it("Should set to expired if no funds approved", async () => {
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

      var signedHash = await bobWallet.signMessage(
        ethers.utils.arrayify(subscriptionHash)
      );

      // initiate subscription
      await contract.executeSubscription(
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

      // No approve ERC20 transfer

      // call subscription
      var failedSubscription = await contract.executeSubscription(
        bob, // recipient
        1, // value
        data, // bytes
        0, // operation: call
        0, // txGas
        0, // dataGas
        0, // gasPrice
        ethAddress, // gasToken
        meta, //bytes
        signedHash
      );


      assert.strictEqual(parseInt(await coin.balanceOf(alice)), 0);

      // TODO: Check that subscription is set to expire
    });
  });
});
