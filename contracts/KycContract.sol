// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./access/roles/MinterRole.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    function setKycCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns(bool) {
        return allowed[_addr];
    }
}