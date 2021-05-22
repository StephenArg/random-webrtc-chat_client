import React from 'react'
import {withRouter, Link} from 'react-router-dom'

function MainMenu() {
    const style = {
        marginTop: "26px",
        marginLeft: "35%",
        width: "28%"
    }

    return (
        <div className="menu-container">
            <Link to="/chat" style={style} >
                <button className="main-menu-button">
                    Chat
                </button>
            </Link>
            <Link to="/connections" style={style} >
                <button className="main-menu-button">
                    Connections
                </button>
            </Link>
            <Link to="/settings" style={style} >
                <button className="main-menu-button">
                    Settings
                </button>
            </Link>
        </div>
    )
}

export default withRouter(MainMenu)
