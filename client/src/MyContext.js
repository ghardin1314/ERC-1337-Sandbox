import React, {useState} from 'react';

const MyContext = React.createContext({});

export const MyProvider = ({children}) => {

    const [state, setState] = useState({
        web3: null,
        contracts: [],
        registry: null,
        shitcoin: null,
        accounts: null,
    })

    // const [web3, updateWeb3]= useState(null)
    // const [contracts, updateContracts]= useState([])
    // const [registry, updateRegistry]= useState(null)
    // const [shitcoin, updateShitcoin]= useState(null)
    // const [accounts, updateAccounts]= useState(null)

    return (
        <MyContext.Provider 
        value ={{
            state,
            setState
            // web3,
            // contracts,
            // registry,
            // shitcoin,
            // accounts,
            // updateWeb3,
            // updateContracts,
            // updateRegistry,
            // updateShitcoin,
            // updateAccounts
        }}>
            {children}
        </MyContext.Provider>
    )
}


export default MyContext;