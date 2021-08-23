const Token = artifacts.require('./MyToken.sol');
require("dotenv").config({path: '../.env'});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("all tokens should be in deployer address", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("it is possible to send tokens between accounts", async () => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("it is not possible to send more tokens than available", async () => {
        let instance = this.myToken;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(deployerAccount, balanceOfDeployer.add(new BN(1)))).to.eventually.be.rejected;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.bignumber.equal(balanceOfDeployer);
    })

});