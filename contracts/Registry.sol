pragma solidity 0.6.12;

contract Registry {

    struct DeployedContract {
        address owner;
        address contractAddress;
    }

    DeployedContract[] public ContractList;

    function RegisterContract(address owner, address contractAddress) public {
        ContractList.push(DeployedContract(owner, contractAddress));
    }

    function getContractsForAddress(address owner) public returns (uint[] memory) {

        uint256 numFound = 0;
        for(uint i = 0; i < ContractList.length; i++) {
            if (ContractList[i].owner == owner ) {
                numFound++;
            }
        }

        uint[] memory ids = new uint[](numFound);
        uint j = 0;

        for(uint i = 0; i < ContractList.length; i++) {
            if (ContractList[i].owner == owner ) {
                ids[j] = i;
                j++;
            }
        }

        return ids;
    }

}