const Pokemon = artifacts.require("Pokemon");

module.exports = function (deployer) {
  deployer.deploy(Pokemon);
};
