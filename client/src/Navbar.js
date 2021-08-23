import React, { Component } from 'react'
import Identicon from 'identicon.js'
import mothertokenbanner from './eth-logo.png'

class Navbar extends Component {
  render() {
    return (
      <nav id='navigation' className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
      <div>
        <img id='first-logo' src={mothertokenbanner} alt='dd' width="35px" height="35px"></img>
        <small id="header">Token Sale</small>
      </div>
      <div id='user-info'>
        <small className='text-secondary'>
            <small id='account'>{this.props.account}</small>
        </small>
        <small className='text-secondary'>
            <small id='account-short'>{this.props.account.substring(0, 7)}...</small>
        </small>  
      </div>

    </nav>
    );
  }
}

export default Navbar;
