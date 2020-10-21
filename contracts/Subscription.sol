pragma solidity >=0.4.21 <0.7.0;

import "./Enum.sol";
import "./ERC165.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";


// contract Subscription is Enum, ERC165 {
contract Subscription is Enum {
    using SafeMath for uint256;

    constructor() public { }

    receive () external payable {
        emit Received(msg.sender, msg.value);
    }

    //------------------- Events -------------------

    event Received (address indexed sender, uint value);


    //------------------- Mapping -------------------

    // for some cases of delegated execution, this contract will pay a third party
    // to execute the transfer. If this happens, the owner of this contract must
    // sign the subscriptionHash

    // In my case, use this to charge the subscription cut possibly?
    mapping(bytes32 => bool) public publisherSigned;

    //------------------- Public View Functions -------------------

    /* @dev Checks if the subscription is valid.
    * @param subscriptionHash is the identifier of the customer's subscription with its relevant details.
    * @return success is the result of whether the subscription is valid or not.
    **/
    function isValidSubscription(
            uint256 subscriptionHash
        ) 
        public 
        view 
        returns (
            bool success
        ) {
            // TODO
            return true;
        }

    /* @dev returns the value of the subscription
    * @param subscriptionHash is the identifier of the customer's subscription with its relevant details.
    * @return status is the enumerated status of the current subscription, 0 expired, 1 active, 2 paused, 3 cancelled
    * @return nextWithdraw is the time to next withdraw in seconds
    **/

    function getSubscriptionStatus(
        uint256 subscriptionHash
        )
        public 
        view 
        returns (
            uint256 status, 
            uint256 nextWithdraw
        ) {
            // TODO
            status = 0;
            nextWithdraw = 0;

            return (status, nextWithdraw);
        }

    /* @dev returns the hash of cocatenated inputs to the address of the contract holding the logic.,
    * the owner would sign this hash and then provide it to the party for execution at a later date,
    * this could be viewed like a cheque, with the exception that unless you specifically
    * capture the hash on chain a valid signature will be executable at a later date, capturing the hash lets you modify the status to cancel or expire it.
    * @param recipient the address of the person who is getting the funds.
    * @param value the value of the transaction
    * @param data the data the user is agreeing to
    * @param txGas the cost of executing one of these transactions in gas(probably safe to pad this)
    * @param dataGas the cost of executing the data portion of the transaction(delegate calls etc)
    * @param gasPrice the agreed upon gas cost of Execution of this subscription(cost incurment is up to implementation, ie, sender or receiver)
    * @param gasToken address of the token in which gas will be compensated by, address(0) is ETH, only works in the case of an enscrow implementation)
    * @param meta dynamic bytes array with 4 slots, 2 required, 2 optional // address refundAddress / uint256 period / uint256 offChainID / uint256 expiration (uinx timestamp)
    * @return subscriptionHash return the hash input arguments concatenated to the address of the contract that holds the logic.
    **/
    function getSubscriptionHash(
        address recipient,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 txGas,
        uint256 dataGas,
        uint256 gasPrice,
        address gasToken,
        bytes memory meta
        )
        public
        view
        returns (
            bytes32 subscriptionHash
        ) {
            // TODO
            subscriptionHash = "TODO";
            return subscriptionHash;
        }

    /* @dev returns the hash of concatenated inputs that the owners user would sign with their public keys
    * @param recipient the address of the person who is getting the funds.
    * @param value the value of the transaction
    * @return returns the hash of concatenated inputs with the address of the contract holding the subscription hash
    **/
    function getModifyStatusHash(
            bytes32 subscriptionHash,
            Enum.SubscriptionStatus status
        )
        public
        view
        returns (
            bytes32 modifyStatusHash
        ){
            // TODO
            modifyStatusHash = "TODO";
            return modifyStatusHash;
        }

    //------------------- Public Functions -------------------

    /* @dev modifys the current subscription status
    * @param subscriptionHash is the identifier of the customer's subscription with its relevant details.
    * @param status the new status of the subscription
    * @param signatures of the requested method being called
    * @return success is the result of the subscription being paused
    **/
    function modifyStatus(
            uint256 subscriptionHash, 
            Enum.SubscriptionStatus status, 
            bytes memory signatures
            ) 
            public 
            returns (
                bool success
            ) {
                // TODO
                return true;
        }

    /* @dev returns the hash of cocatenated inputs to the address of the contract holding the logic.,
    * the owner would sign this hash and then provide it to the party for execution at a later date,
    * this could be viewed like a cheque, with the exception that unless you specifically
    * capture the hash on chain a valid signature will be executable at a later date, capturing the hash lets you modify the status to cancel or expire it.
    * @param to the address of the person who is getting the funds.
    * @param value the value of the transaction
    * @param data the data the user is agreeing to
    * @param txGas the cost of executing one of these transactions in gas(probably safe to pad this)
    * @param dataGas the cost of executing the data portion of the transaction(delegate calls etc)
    * @param gasPrice the agreed upon gas cost of Execution of this subscription(cost incurment is up to implementation, ie, sender or receiver)
    * @param gasToken address of the token in which gas will be compensated by, address(0) is ETH, only works in the case of an enscrow implementation)
    * @param meta dynamic bytes array with 4 slots, 2 required, 2 optional // address refundAddress / uint256 period / uint256 offChainID / uint256 expiration (uinx timestamp)
    * @param signatures signatures concatenated that have signed the inputs as proof of valid execution
    * @return success something to note that a failed execution will still pay the issuer of the transaction for their gas costs.
    **/
    function executeSubscription(
            address to,
            uint256 value,
            bytes memory data,
            Enum.Operation operation,
            uint256 txGas,
            uint256 dataGas,
            uint256 gasPrice,
            address gasToken,
            bytes memory meta,
            bytes memory signatures
            )
            public 
            returns (
                bool success
            ) {
                // TODO
                return true;
        }

    
}