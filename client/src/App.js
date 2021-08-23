import React, { Component } from "react";
import MyToken from "./contracts/UniERC20.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import getWeb3 from "./getWeb3";
import Navbar from "./Navbar.js";
import BuyTokens from "./BuyTokens.js";
import image from './eth-logo.png'

import "./App.css";
 
class App extends Component {
  state = { loaded:false, tokenSaleAddress: null, userTokens:0, weiRaised: 0, leftTokens: 0, scPercentage: 0, hcPercentage: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );
      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.softCap = await this.tokenSaleInstance.methods.softCap().call();
      this.softCap = this.softCap / 10**18
      this.hardCap = await this.tokenSaleInstance.methods.hardCap().call();
      this.hardCap = this.hardCap / 10**18

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({loaded:true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address}, this.updateTotalSupply);
      this.setState(this.updateWeiRaised);
      this.setState(this.updateUserTokens);
      this.setState(this.updateLeftTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.web3.currentProvider.selectedAddress).call();
    this.setState({userTokens: userTokens/10**18});
  }

  updateWeiRaised = async () => {
    let weiRaised = await this.tokenSaleInstance.methods.weiRaised().call();
    this.setState({weiRaised});
    const scPercentage = (this.state.weiRaised / this.softCap * 100).toFixed(2);
    const hcPercentage = (this.state.weiRaised / this.hardCap * 100).toFixed(2);
    let scProgress = document.getElementById("sc-progress");
    if (scPercentage <= 100)
    {
      scProgress.style.width = scPercentage.toString()+"%";
      this.setState({scPercentage});
    } else {
      scProgress.style.width = "100%";
      this.setState({scPercentage: 100});
    }

    this.setState({hcPercentage});

    let hcProgress = document.getElementById("hc-progress");
    hcProgress.style.width = hcPercentage.toString()+"%";
  }

  updateLeftTokens = async () => {
    let leftTokens = await this.tokenInstance.methods.balanceOf(MyTokenSale.networks[this.networkId].address).call();
    this.setState({leftTokens: leftTokens/10**18});
  }

  listenToTokenTransfer = async () => {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateWeiRaised);
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateLeftTokens);
  }

  handleBuyTokens = async () => {
    let value = document.getElementById("tokenNum").value*10**18;
    if (value === "") {
      alert("Please enter an amount of tokens")
      return;
    }
    let weiAmount = await this.getWeiAmount(value);
    let receipt = await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: weiAmount});
    console.log(receipt);
  }

  getWeiAmount = async (tokenAmount) => {
    let rate = await this.tokenSaleInstance.methods.rate().call();
    let weiAmount = tokenAmount / rate;
    return weiAmount;
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Navbar account={this.web3.currentProvider.selectedAddress}/>
        <img src={image} alt="logo" id="logo" width="100" height="100"></img>
        <h1 className="first-header">Token Sale</h1>
        <h4>Soft Cap: {this.softCap} Wei</h4>
        <h4>Hard Cap: {this.hardCap} Wei</h4>
        <h4>{this.state.weiRaised} wei has been raised so far.</h4>
        <br></br>
        <h4>Hard Cap Progress</h4>
        <div id="hc-progress-wrap" className="w3-light-grey w3-round-xlarge">
          <div id="hc-progress" className="w3-container w3-round-xlarge">{this.state.hcPercentage}%</div>
        </div>
        <br></br>
        <h4>Soft Cap Progress</h4>
        <div id="sc-progress-wrap" className="w3-light-grey w3-round-xlarge">
          <div id="sc-progress" className="w3-container w3-round-xlarge">{this.state.scPercentage}%</div>
        </div>
        <br></br>
        <BuyTokens
          leftTokens={this.state.leftTokens}
          userTokens={this.state.userTokens}
          handleBuyTokens={this.handleBuyTokens}
        />
      </div>
    );
  }
}

export default App;
