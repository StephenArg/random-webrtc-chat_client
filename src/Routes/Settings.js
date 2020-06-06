import React, {useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import authenticateUser from '../util/authenticateUser'

function Settings(props) {

    useEffect(() => {
        authenticateUser(props.history)
    }, [])

    const handleClick = () => {
        props.history.push('/')
    }

    return (
        <div>
            <h1>Settings</h1>
            <button onClick={handleClick}>homepage</button>
        </div>
    )
}

export default withRouter(Settings)