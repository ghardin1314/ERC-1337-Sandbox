var Subscription = artifacts.require("./Subscription.sol");

// Remember to change this

module.exports = function (deployer) {
  deployer.deploy(
    Subscription,
    "0x67f7328a30de1fa2c1fad75f444cce93c58c5aa8",
    "0x67f7328a30de1fa2c1fad75f444cce93c58c5aa8"
  );
};
