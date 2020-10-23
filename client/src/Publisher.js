import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, {useContext} from 'react'
import MyContext from './MyContext'

export default function Publisher() {

    const context = useContext(MyContext)

    return (
        <div>
            <form>
                <Select>
                    {context.shitcoin ? <MenuItem value={context.shitcoin._address}>ShitCoin</MenuItem> : null}
                </Select>
            </form>
        </div>
    )
}
