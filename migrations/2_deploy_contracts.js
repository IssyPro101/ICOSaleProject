var SwiftToken = artifacts.require("../../SwiftSwap/uniswap-fork/core/contracts/SwiftToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  let tokenInstance = await SwiftToken.at("0x6dB182d7a5317c3F8614263083832f075e42ab86");
  let totalSupply = await tokenInstance.totalSupply();
  console.log(totalSupply.toString());
  await deployer.deploy(MyTokenSale, "1", addr[0], "0x6dB182d7a5317c3F8614263083832f075e42ab86", "250000000000000000000000", "1000000000000000000000000");
  console.log("Sending...");
  await tokenInstance.transfer(MyTokenSale.address, "1000000000000000000000000");
};