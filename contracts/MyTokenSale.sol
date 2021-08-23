// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale {

    KycContract kyc;
    constructor (
        uint256 _rate,    // rate in TKNbits
        address payable _wallet,
        IERC20 _token,
        uint256 _softCap,
        uint256 _hardCap
    )
        Crowdsale(1 ether, _wallet, _token, _softCap, _hardCap)
    {

    }

}