const assert = require("assert");
const utils = require("./helpers/utils");
const Subscription = artifacts.require("Subscription");
const { ethers, Wallet } = require("ethers");
const { debug } = require("console");
// const truffleAssert = require("truffle-assertions");

contract("Subscription", (accounts) => {
  let [alice, bob] = accounts;

  let contract;
  let bobSK;
  let bobWallet;
  beforeEach(async () => {
    contract = await Subscription.new();
    bobSK = "c98011a7325562556e5e476f2f8dc8db97558103dd4845ec41d573d9ba210f6a";
    bobWallet = new ethers.Wallet(new Buffer(bobSK, "hex"));
  });

  afterEach(async () => {
    // await contract.kill();
  });

  context("With creating a new subscription", async () => {
    it("Should return subscription hash", async () => {
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
        "0x6597b3133091d6827ac540e0b96e4ec452cc4bf6f4da819d98ca1a7c735c300d",
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

  context("With checking for valid subscriptions", async () => {
    it("Should return true for a valid subscription", async () => {
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

  context("With checking subscription status", async () => {
    it("Should return active for an active subscription", async () => {
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

  context("With modifying subscription status", async () => {
    it("Should return modify status hash", async () => {
      var data = ["0x00"];

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
        "0xeae13da5f9049a536bf2ffa17aad1ec19f5ec2dee5873d4ffb953d38fdb84b0b",
        modifyStatusHash
      );
    });
    
    it("Should modify status of subscription to canceled", async () => {
        var data = ["0x00"];
  
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
        )

        assert.strictEqual(
          Boolean(modifyStatus),
          true
        );

        var subscriptionStatus = await contract.getSubscriptionStatus(
            modifyStatusHash
          );
    
          assert.strictEqual(parseInt(subscriptionStatus[0]), 3);

      });

});
});
