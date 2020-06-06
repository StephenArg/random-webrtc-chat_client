import React, {useState} from 'react'

function ChatBox({user, myLocation}) {

    const [formValue, setFormValue] = useState("")

    const submitMessage = (e) => {
        e.preventDefault()
    }

    // let allMessages = this.state.chatMessages.map(message => {
    //     return <li key={message.id} className="text-messages" ><small>{message.user_id}: {message.content}</small></li>
    // })

    return (
        <div>
                <div className="chat-box">
                    <ul className="chat-list">
                        <h5 className="location-messages"> Chat Messages</h5>
                        <h5 className="location-messages"> - {user.name} (You) - Location: {myLocation}</h5>
                        {/* guestLocation */ true ?
                        (<h5 className="location-messages"> - {"guestName"} (Joined) - Location: {"guestLocation"} </h5>)
                        : null}
                        {/* {allMessages} */}
                    </ul>
                </div>
                <form onSubmit={submitMessage}>
                    <input name="message" placeholder="Enter text here" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    <input type="submit" value="Send" />
                </form>
            </div>
    )
}

export default ChatBox
