const Migrations = artifacts.require("MyToken");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
