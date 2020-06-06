import React from 'react'
import {withRouter, Link} from 'react-router-dom'

function MainMenu() {
    return (
        <div className="menu-container">
            <Link to="/chat" >Chat</Link>
            <Link to="/connections" >Connections</Link>
            <Link to="/settings" >Settings</Link>
        </div>
    )
}

export default withRouter(MainMenu)
