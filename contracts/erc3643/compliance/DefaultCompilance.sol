// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

//import "./Compliance.sol";

contract DefaultCompliance {

    function transferred(address _from, address _to, uint256 _value) external  {
    }

    function created(address _to, uint256 _value) external  {
    }

    function destroyed(address _from, uint256 _value) external  {
    }

    function canTransfer(address /*_from*/, address /*_to*/, uint256 /*_value*/) external pure  returns (bool) {
        return true;
    }
}