import React from 'react'

export default function ChatRoom(props) {

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
