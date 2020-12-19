import React, {useState, Fragment} from 'react'
import { connect } from 'react-redux';
import { addMessage, increaseMessageIdCounter } from '../StoreManagers/MessagesManager'
import {updateScroll} from '../util/helperFunctions'

function ChatBox(props) {
    const {user, myLocation, otherUsersInfo, handleSubmitMessage,
        addMessage, messages, increaseMessageIdCounter, messageIdCounter,
        chatting, stopChatting, startChatting, handleTest, startOrStopChattingButtonEnabled} = props
    const [formValue, setFormValue] = useState("")
    // const [messageIdCounter, setMessageIdCounter] = useState(0)
    // const [chatMessages, setChatMessages] = useState([])

    const submitMessage = (e) => {
        e.preventDefault()
        if(formValue.length > 0) {
            const d = new Date();
            const time = d.toLocaleTimeString();
            handleSubmitMessage(formValue)
            addMessage({id: messageIdCounter, name: 'Me', content: formValue, time: time })
            setFormValue("")
            increaseMessageIdCounter()
            updateScroll()
        }
    }

    // const allMessages = messages.map(message => {
    //     return (<div key={message.id} style={!message.otherUser ? {justifyContent: 'flex-end'} : null} className="text-messages" >
    //             <small>{message.name}: {message.content}</small>
    //             </div>)
    // &nbsp;
    // })

    const allMessages = messages.map(message => {
        return (<div key={message.id} style={!message.otherUser ? {justifyContent: 'flex-end'} : null} className="text-messages-container" >
                    <div style={{width: '100%', display: 'block'}}>
                        <div className="message-data" style={!message.otherUser ? {textAlign: 'right'} : null} >
                            <span className="message-data-time">{message.time}</span>
                            <span className="message-data-name">{message.otherUser ? ` - ${message.name}` : null}</span>
                        </div>
                        <div className="message" style={!message.otherUser ? {float: 'right'} : null}>
                            {message.content}
                        </div>
                    </div>
                </div>)
    })


    return (
        <div>
            <div className="chat-list">
                <div className="location-messages"> Chat Messages</div>
                <div className="location-messages"> - {user.name} (You) - Location: {myLocation}</div>
                {otherUsersInfo.name !== 'N/A' ?
                (<Fragment>
                    <div className="location-messages"> - {otherUsersInfo.name} (Joined) - Location: {otherUsersInfo.location} </div>
                    <hr className="chat-box-hr" />
                </Fragment>)
                : null}
                {allMessages}
            </div>
            <form onSubmit={submitMessage} style={{width: "785px", height: "3em"}}>
                <input id="chatbox-message-form" autoComplete="off" name="message" placeholder="Enter message here" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <input id="chatbox-message-send-button" type="submit" value="Send"/>
                <button disabled={!chatting} className="next-chatbox-button" onClick={handleTest}>Test</button>
                { chatting ? <button className="start-stop-chatbox-button" disabled={!startOrStopChattingButtonEnabled} onClick={stopChatting} >Stop Chatting</button> :
                 <button className="start-stop-chatbox-button" disabled={!startOrStopChattingButtonEnabled} onClick={startChatting}>Start Chatting</button>}
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
