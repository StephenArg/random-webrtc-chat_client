import React from 'react'

export default function Settings(props) {

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
