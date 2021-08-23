const TokenSale = artifacts.require('./MyTokenSale.sol');
const Token = artifacts.require('./MyToken.sol');
const KycContract = artifacts.require('./KycContract.sol');
require("dotenv").config({path: '../.env'});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("it should not have any tokens in by deployerAccount", async () => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("all tokens should be in the TokenSale contract by default", async () => {
        let instance = await Token.deployed();
        let tokenSale = await TokenSale.deployed();
        let totalSupply = await instance.totalSupply();

        return expect(instance.balanceOf(tokenSale.address)).to.eventually.be.a.bignumber.equal(totalSupply);
        
    })
    
    it("it should be possible to buy tokens", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        let kycContract = await KycContract.deployed();
        await kycContract.setKycCompleted(deployerAccount, {from: deployerAccount});
        await expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.fromWei("1", "wei")})).to.be.fulfilled;
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));

    })
});