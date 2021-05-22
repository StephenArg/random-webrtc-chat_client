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
        <div style={{marginTop: "-22px"}}>
            <div className="inner-container">
                <h1>Settings</h1>
                <button onClick={handleClick}>homepage</button>  
            </div>
        </div>
    )
}

export default withRouter(Settings)