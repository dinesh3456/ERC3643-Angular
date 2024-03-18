// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;
import "../identies/identity.sol";
import "../identies/ClaimIssuer.sol";

contract factory{
    mapping (address=>address) usertoidentity;
    mapping(address=>bool) isregisteredIdentity;
    mapping (address=>address) usertoclaimIssuer;
    mapping(address=>bool) isregisteredClaimIssuer;
    function createidentity(address _useraddress) public payable returns(address){
        require(!isregisteredIdentity[_useraddress],"you are already registered");
        require(msg.value >= 0.001 ether, "Insufficient payment for identity creation");

        address _address=address(new identities(_useraddress));
        usertoidentity[_useraddress]=_address;
         isregisteredIdentity[_useraddress]=true;

        return _address;
    }

    function getidentity(address _useraddress) public view returns(address){
        return usertoidentity[_useraddress];
    }
    

// identities _identity = new identities(_useraddress);
//       address _identityAddress = address(_identity);
//       usertoidentity[_useraddress]=_address;

    function createClaimIssuer(address _useraddress) public returns(address){
        require(!isregisteredClaimIssuer[_useraddress],"you are already registered");
        address _address=address(new ClaimIssuers(_useraddress));
        usertoclaimIssuer[_useraddress]=_address;
         isregisteredClaimIssuer[_useraddress]=true;

        return _address;
    }

    function getClaimIssuer(address _useraddress) public view returns(address){
        return usertoclaimIssuer[_useraddress];
    }

}

