import React, {useState} from 'react';

const MyContext = React.createContext({});

export const MyProvider = ({children}) => {

    var coinDict = {}

    const [state, setState] = useState({
        web3: null,
        contracts: [],
        registry: null,
        shitcoin: null,
        accounts: null,
        coinDict: coinDict
    })



    return (
        <MyContext.Provider 
        value ={{
            state,
            setState
        }}>
            {children}
        </MyContext.Provider>
    )
}


export default MyContext;