pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ShitCoin is ERC20 {

    constructor() public ERC20("ShitCoin", "SHT") {}

    function mintTokens(address recipent) public {
        _mint(recipent, 1000);
    }
}