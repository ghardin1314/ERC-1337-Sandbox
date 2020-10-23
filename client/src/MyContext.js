import React, {useState} from 'react';

const MyContext = React.createContext({});

export const MyProvider = ({children}) => {
    const [web3, updateWeb3]= useState(null)
    const [contracts, updateContracts]= useState([])
    const [registry, updateRegistry]= useState(null)
    const [shitcoin, updateShitcoin]= useState(null)
    const [accounts, updateAccounts]= useState(null)

    return (
        <MyContext.Provider 
        value ={{
            web3,
            contracts,
            registry,
            shitcoin,
            accounts,
            updateWeb3,
            updateContracts,
            updateRegistry,
            updateShitcoin,
            updateAccounts
        }}>
            {children}
        </MyContext.Provider>
    )
}


export default MyContext;