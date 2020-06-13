import React, {useState} from 'react'
import { connect } from 'react-redux';
import { addMessage, increaseMessageIdCounter } from '../storeManagers/MessagesManager'

function ChatBox(props) {
    const {user, myLocation, otherUsersInfo, handleSubmitMessage, addMessage, messages, increaseMessageIdCounter, messageIdCounter} = props
    const [formValue, setFormValue] = useState("")
    // const [messageIdCounter, setMessageIdCounter] = useState(0)
    // const [chatMessages, setChatMessages] = useState([])

    const submitMessage = (e) => {
        e.preventDefault()
        handleSubmitMessage(formValue)
        addMessage({id: messageIdCounter, name: 'Me', content: formValue })
        setFormValue("")
        increaseMessageIdCounter()
    }

    const allMessages = messages.map(message => {
        return <li key={message.id} className="text-messages" ><small>{message.name}: {message.content}</small></li>
    })


    return (
        <div>
                <div className="chat-box">
                    <ul className="chat-list">
                        <h5 className="location-messages"> Chat Messages</h5>
                        <h5 className="location-messages"> - {user.name} (You) - Location: {myLocation}</h5>
                        {otherUsersInfo.name !== 'N/A' && otherUsersInfo.location !== 'N/A' ?
                        (<h5 className="location-messages"> - {otherUsersInfo.name} (Joined) - Location: {otherUsersInfo.location} </h5>)
                        : null}
                        {allMessages}
                    </ul>
                </div>
                <form onSubmit={submitMessage}>
                    <input name="message" placeholder="Enter text here" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    <input type="submit" value="Send" />
                </form>
            </div>
    )
}

const mapStateToProps = function(state) {
    const {Messages} = state
    return {
      messages: Messages.messages,
      messageIdCounter: Messages.messageIdCounter
    }
  }

  const mapDispatchToProps = {
      addMessage: message => addMessage(message),
      increaseMessageIdCounter: () => increaseMessageIdCounter()
  }

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
