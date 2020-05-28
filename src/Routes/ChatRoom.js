import React from 'react'
import { withRouter } from 'react-router-dom'

function ChatRoom(props) {

    const handleClick = () => {
        props.history.push('/settings')
    }

    return (
        <div>
            <h2>Chatting</h2>
            <button onClick={handleClick}>settings</button>
        </div>
    )
}

export default withRouter(ChatRoom)