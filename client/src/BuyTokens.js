
import React, { Component } from 'react'
import Identicon from 'identicon.js'
import mothertokenbanner from './logo.png'

class Navbar extends Component {
    render() {
        return (
          <div>
            <h2>Buy Tokens</h2>
            <h4>Tokens left for sale: {this.props.leftTokens}</h4>
            <h4>The rate is: 1 Token = 1 Wei or 0.0000000000000000001 Ether.</h4>
            <h4>You currently have: {this.props.userTokens} Swift Tokens</h4>
            <div id="buy-tokens">
                <div class="button_cont" align="center" onClick={this.props.handleBuyTokens}>
                    <a class="buy" rel="nofollow noopener">Buy Tokens</a>
                </div>
                <input id="tokenNum"></input>
            </div>
          </div>
        );
    }  
}

export default Navbar;

