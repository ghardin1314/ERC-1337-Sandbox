/// @title Enum - Collection of enums
/// Original concept from Richard Meissner - <richard@gnosis.pm> Gnosis safe contracts
pragma solidity >=0.4.21 <0.7.0;

contract Enum {
    enum Operation {
        Call,
        DelegateCall,
        Create,
        ERC20, 
        ERC20Approve
    }
    
    enum SubscriptionStatus {
        ACTIVE,
        PAUSED,
        CANCELLED,
        EXPIRED
    }
    
    enum Period {
        INIT,
        DAY,
        WEEK,
        MONTH
    }
}