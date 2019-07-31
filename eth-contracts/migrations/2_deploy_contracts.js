// migrating the appropriate contracts
// var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var verifier = artifacts.require("./verifier.sol");

module.exports = function(deployer) {
  deployer.deploy(verifier).then(() => {
    deployer.deploy(SolnSquareVerifier, verifier.address)
  });
  // deployer.deploy(SquareVerifier);
  // deployer.deploy(SolnSquareVerifier);
};
