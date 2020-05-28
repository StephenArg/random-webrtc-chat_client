import React from 'react'
import { withRouter } from 'react-router-dom'

function Settings(props) {

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