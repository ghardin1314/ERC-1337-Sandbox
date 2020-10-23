pragma solidity 0.6.12;

import "./Enum.sol";
import "./ERC165.sol";


import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


// contract Subscription is Enum, ERC165 {
contract Subscription is Enum {

    // I am going to implement this backwards, where the publisher is the owner and the the subscriber is the reciepent

    using SafeMath for uint256;
    using ECDSA for bytes32;

    receive () external payable {
        emit Received(msg.sender, msg.value);
    }

    //------------------- Storage -------------------

    struct Subscriptions {
        address subscriber;
        Enum.SubscriptionStatus status;
        Enum.Period period;
        Enum.Operation operation;
        uint256 value;
        uint256 txGas;
        uint256 dataGas;
        uint256 gasPrice;
        uint256 nextWithdraw;
        address gasToken;
        bytes data;
        bytes meta;
        // bytes32 subscriptionHash;
    }

    struct MetaStruct {
        address refundAddress;
        uint256 period;
        uint256 offChainID;
        uint256 expiration;
    }

    Subscriptions[] public SubscriptionList;

    address private _publisher;
    address private _master;

    constructor(address publisher, address master) public {

        _publisher = publisher;
        _master = master;

        // Make first subscription object in list invalid
        SubscriptionList.push(Subscriptions(
            address(0),
            Enum.SubscriptionStatus(3),
            Enum.Period(0),
            Enum.Operation(2),
            0,
            0,
            0,
            0,
            0,
            address(0),
            abi.encode(0),
            abi.encode(0)
        ));
    }

    //------------------- Events -------------------

    event Received (address indexed sender, uint value);
    event createdSubscription(address to);


    event addressEvent (address add);
    event uintEvent (uint256 a);
    event boolEvent (bool truth);
    event stringEvent (string todo);

    //------------------- Mapping -------------------

    // for some cases of delegated execution, this contract will pay a third party
    // to execute the transfer. If this happens, the owner of this contract must
    // sign the subscriptionHash

    // In my case, use this to charge the subscription cut possibly?
    mapping(bytes32 => bool) public publisherSigned;

    mapping(bytes32 => uint256) public hashToSubscription;
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
            return hashToSubscription[bytes32(subscriptionHash)] != 0;
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
            return (
                uint256(SubscriptionList[hashToSubscription[bytes32(subscriptionHash)]].status), 
                SubscriptionList[hashToSubscription[bytes32(subscriptionHash)]].nextWithdraw
                );
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
            bytes32 
        ) {
            // TODO: Add requirements 
            
        return keccak256(
            abi.encodePacked(
                byte(0x19), 
                byte(0), 
                recipient, 
                value, 
                data, 
                // operation, 
                txGas, 
                dataGas, 
                gasPrice, 
                gasToken, 
                meta,
                Enum.SubscriptionStatus.ACTIVE
        ));
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
            bytes32 
        ){
        // TODO

        uint subscriptionId = hashToSubscription[subscriptionHash];

        require (subscriptionId != 0, "Invalid subscriptionHash" );

        // does status go into data?

        return keccak256(
            abi.encodePacked(
                byte(0x19), 
                byte(0), 
                SubscriptionList[subscriptionId].subscriber, 
                SubscriptionList[subscriptionId].value, 
                SubscriptionList[subscriptionId].data, 
                // SubscriptionList[subscriptionId].operation, 
                SubscriptionList[subscriptionId].txGas, 
                SubscriptionList[subscriptionId].dataGas, 
                SubscriptionList[subscriptionId].gasPrice, 
                SubscriptionList[subscriptionId].gasToken, 
                SubscriptionList[subscriptionId].meta,
                status
        ));
        }

    //------------------- Public Functions -------------------

    /* @dev modifys the current subscription status
    * @param subscriptionHash is the identifier of the customer's subscription with its relevant details.
    * @param status the new status of the subscription
    * @param signatures of the requested method being called
    * @return success is the result of the subscription being paused
    **/
    function modifyStatus(
        bytes32 subscriptionHash, 
        Enum.SubscriptionStatus status, 
        bytes memory signatures
        ) 
        public 
        returns (
            bool success
        ) {
        // TODO

        uint256 subNumber = hashToSubscription[subscriptionHash];

        bytes32 modifyStatusHash = getModifyStatusHash(subscriptionHash, status);

        address signer = _getSubscriptionSigner(modifyStatusHash, signatures);

        if(signer != msg.sender) {
            return false;
        } else {
            hashToSubscription[subscriptionHash] = 0;
            hashToSubscription[modifyStatusHash] = subNumber;
            SubscriptionList[subNumber].status = status;
            return true;
        }
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

            // create subscription hash

            bytes32 _subHash = getSubscriptionHash(to, value, data, operation, txGas, dataGas, gasPrice, gasToken, meta);

            // check for valid signature

            address signer = _getSubscriptionSigner(_subHash, signatures);

            // If creating subscription
            if (operation == Enum.Operation.Create) {
                // Subscriber must initialize their own subscription
                if (signer != msg.sender) {

                    return false;

                } else {

                    SubscriptionList.push(Subscriptions(
                            to, 
                            Enum.SubscriptionStatus.ACTIVE, 
                            Enum.Period(_periodFromMeta(meta)), 
                            operation, 
                            value, 
                            txGas, 
                            dataGas, 
                            gasPrice,
                            block.timestamp - 1, 
                            gasToken, 
                            data, 
                            meta
                        )
                    );

                    emit createdSubscription(to);

                    hashToSubscription[_subHash] = SubscriptionList.length - 1;
                    return true;
                }

            } else if (operation == Enum.Operation.Call) {

                if (signer != SubscriptionList[hashToSubscription[_subHash]].subscriber ) {
                    // not a correctly signed meta transaction
                    return false;
                }

                // TODO: check for valid timestamp
                if (SubscriptionList[hashToSubscription[_subHash]].nextWithdraw > block.timestamp) {
                    return false;
                } else {
                    _updateTimestamp(_subHash);
                    return _transferTokens(_subHash);
                }
            }
        }

    //------------------- Private Functions -------------------

    function _updateTimestamp(bytes32 _subHash) internal {
        Enum.Period _period = SubscriptionList[hashToSubscription[_subHash]].period;

        if (_period == Enum.Period(0)) {
            SubscriptionList[hashToSubscription[_subHash]].nextWithdraw = block.timestamp.add(60);
        } else if (_period == Enum.Period(1)) {
            SubscriptionList[hashToSubscription[_subHash]].nextWithdraw = block.timestamp.add(86400);
        } else if (_period == Enum.Period(2)) {
            SubscriptionList[hashToSubscription[_subHash]].nextWithdraw = block.timestamp.add(604800);
        } else if (_period == Enum.Period(3)){
            SubscriptionList[hashToSubscription[_subHash]].nextWithdraw = block.timestamp.add(2592000);
        }
        require(SubscriptionList[hashToSubscription[_subHash]].nextWithdraw > block.timestamp, "Failed to update next withdraw");
    }

    function _getSubscriptionSigner(
        bytes32 subscriptionHash, 
        bytes memory signatures
        ) 
        internal 
        pure
        returns (
            address
        )  {
        return subscriptionHash.toEthSignedMessageHash().recover(signatures);
    }

    function _refundAddressFromMeta(
        bytes memory meta
        ) 
        internal 
        pure
        returns (
            address
        )  {
        (address _refundAddress, uint256 _period, uint256 _offChainId, uint256 _expiration) = abi.decode(meta, (address, uint256, uint256, uint256));
        return _refundAddress;
    }

    function _periodFromMeta(
        bytes memory meta
        ) 
        internal 
        pure
        returns (
            uint256
        ){
        (address _refundAddress, uint256 _period, uint256 _offChainId, uint256 _expiration) = abi.decode(meta, (address, uint256, uint256, uint256));
        return _period;
    }

    function _tokenFromData(
        bytes memory data
        ) 
        internal 
        pure
        returns (
            address
        ){
        (address _tokenAddress) = abi.decode(data, (address));
        return _tokenAddress;
    }


    function _transferTokens(bytes32 _subHash) internal returns (bool) {

        Subscriptions memory _subscription = SubscriptionList[hashToSubscription[_subHash]];

        address _tokenAddress = _tokenFromData(_subscription.data);
        
        if (ERC20(_tokenAddress).allowance(_subscription.subscriber, address(this)) == 0) {
            // No allowance left on ERC20 contract so setting to expire
            SubscriptionList[hashToSubscription[_subHash]].status = Enum.SubscriptionStatus(3);
            return false;
        }

        uint256 _startingBalance = ERC20(_tokenAddress).balanceOf(_publisher);

        ERC20(_tokenAddress).transferFrom(_subscription.subscriber, _publisher, _subscription.value);

        // Check if it worked
        if (_startingBalance + _subscription.value == ERC20(_tokenAddress).balanceOf(_publisher)) {
            return true;
        } else {
            return false;
        }
    }
}