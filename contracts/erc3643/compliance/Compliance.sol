// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ICompliance.sol";
import "../roles/AgentRole.sol";
import "../token/token.sol";
import "../token/Itoken.sol";


contract BasicComplaince is Ownable, ICompliance {

    constructor(address initialOwner) Ownable(initialOwner){}

//Mapping    
    mapping(address => bool) private _tokenAgentlist;

    IToken public tokenBound;

    modifier onlyToken(){
        require(_isToken(),"This address is not token bound to the complaince address");
        _;
    }

     modifier onlyAdmin(){
        require(owner()==msg.sender ||(AgentRole(address(tokenBound))).isAgent(msg.sender),"Only owner can call ");
        _;
    }

    function addTokenAgent(address _agentAddress) external  override  onlyOwner{
        require(_tokenAgentlist[_agentAddress], "This Agent is already registered yet");
        _tokenAgentlist[_agentAddress] = true;
        emit TokenAgentAdded(_agentAddress);
    }

    function removeTokenAgent(address _agentAddress) external  override  onlyOwner{
        require(_tokenAgentlist[_agentAddress], "This Agent is not registered yet");
        _tokenAgentlist[_agentAddress] = false;
        emit TokenAgentRemoved(_agentAddress);
    }

    function bindToken(address _token) external override {
        require(owner()==msg.sender||(address(tokenBound)==address(0) && msg.sender ==_token), "Only owner or token can call");
        tokenBound = IToken(_token);
        emit TokenBound(_token);
    }

    function unbindToken(address _token) external override {
        require(owner()==msg.sender|| msg.sender ==_token, "Only owner or token can call");
        require(_token == address(tokenBound),"This token is not bound");
        delete tokenBound;
        emit TokenBound(_token);
    }

    function isTokenAgent(address _agentAddress) public override view returns(bool){
        if(!_tokenAgentlist[_agentAddress] && !(AgentRole(address(tokenBound))).isAgent(_agentAddress)){
           return true;
        }
        else{
           return false;
        }
    }

    function isTokenBound(address _token) public override view returns(bool){
        if(_token !=address(tokenBound)){
            return false;
        }
        else {
            return true;
        }
    }

    function _isToken() internal view returns (bool) {
        return isTokenBound(msg.sender);
    }

    // goes to identityregistry contract then identity function and it reflects to identityregistrystorage .
    // _useraddress == address of wallet.
    function _getIdentity(address _userAddress) internal view returns(address){
        return address(tokenBound.identityRegistry().identity(_userAddress));
    }

    function _getCountry(address _userAddress) internal view  returns(uint){
        return tokenBound.identityRegistry().investorCountry(_userAddress);
    }

    function created(address _to, uint256 _amount) external virtual override {}

    function destroyed(address _from, uint256 _amount) external virtual override {}

    function transferred(address _from, address _to, uint256 _value) external virtual  override {}

    function canTransfer(address /*_from*/, address /*_to*/, uint256 /*_value*/) external virtual pure override returns (bool) {
        return true;
    }

}