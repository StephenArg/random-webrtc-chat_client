/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import authenticateUser from '../util/authenticateUser'
import requestNewConversation from '../util/requestNewConversation'
import {onMessage, onOpen, onClose, subscribeToConversationChannel, sendCommandToConversationChannel} from '../util/websocketFunctions'
import ChatBox from '../components/ChatBox'
import { receiveUser } from '../storeManagers/AuthManager';

var pcConfig = {
    'iceServers': [{"urls": "stun:stun.l.google.com:19302"},
    {"urls":"turn:numb.viagenie.ca", "username":"webrtc@live.com", "credential":"muazkh"}]
  };
var constraints = { video: true, audio: true };
var localVideo;
var remoteVideo;
var myStream;
var socket;

function ChatRoom(props) {
    const {user, signedIn, myLocation, receiveUser} = props
    const [chatting, setChatting] = useState(false)
    const [conversationInfo, setConversationInfo] = useState(null)
    const [websocketEstablished, setWebsocketEstablished] = useState(false)
    const [subscribedToConversationChannel, setSubscribedToConversationChannel] = useState(false)

    useEffect(() => {
        if (!signedIn){
          authenticateUser(props.history).then((user) => receiveUser(user))
        }
        socket = new WebSocket("ws://localhost:3000/cable")
        socket.onmessage = (params) => onMessage(params, setSubscribedToConversationChannel)
        socket.onclose = onClose
        socket.onopen = (params) => onOpen(params, setWebsocketEstablished)
    }, [])

    useEffect(() => {
        async function asyncSetMyStream() {
            myStream = await navigator.mediaDevices.getUserMedia(constraints);
            intializeLocalElementStream()
            setConversationInfo(await requestNewConversation(user))
            // intializeRemoteElementStream()
        }
        if (user) {asyncSetMyStream()}
    }, [user])

    useEffect(() => {
        if (websocketEstablished && conversationInfo) {
            subscribeToConversationChannel(socket, conversationInfo, user)
        }
    }, [websocketEstablished, conversationInfo])

    useEffect(() => {
        if (websocketEstablished && conversationInfo && conversationInfo.make_offer) {
            console.log('make offer')
        } else {
            console.log('wait for answer')
        }
    }, [subscribedToConversationChannel])

    const sendThroughWebsocket = (action, payload) => {
        sendCommandToConversationChannel(socket, conversationInfo, user, action, payload)
    }

    const intializeLocalElementStream = () => {
        localVideo = document.getElementById('myVideo'); 
        localVideo.width = 400
        localVideo.muted = true
        try {
            localVideo.srcObject = myStream;
        } catch (error) {
            localVideo.src = window.URL.createObjectURL(myStream);
        }
        // setReadyToInitialize(true)
    }

    const intializeRemoteElementStream = () => {
        remoteVideo = document.getElementById('theirVideo'); 
        remoteVideo.width = 400
        remoteVideo.muted = true
        try {
            remoteVideo.srcObject = myStream;
        } catch (error) {
            remoteVideo.src = window.URL.createObjectURL(myStream);
        }
        // setReadyToInitialize(true)
    }

    const handleRerouteHome = () => {
        const tracks = myStream.getTracks();
        tracks.forEach(function(track) {
            track.stop()
            myStream.removeTrack(track)
        });
        myStream = null
        socket.close()
        props.history.push('/')
    }

    const startChatting = () => {
        // setChatting(true)
        sendThroughWebsocket('printParams', {what: "more stuff in here"})
    }

    const stopChatting = () => {
        setChatting(false)
    }

    if(!user){
        return(<h1>Loading...</h1>)
    }

    return (
        <div>
            <div className="chatroom-container">
                <div className="video-frame">
                <video id="myVideo" poster={process.env.PUBLIC_URL + 'loading.gif'} autoPlay></video>
                <br type="block"/>
                <video id="theirVideo" poster={process.env.PUBLIC_URL + 'loading.gif'} autoPlay></video>

                {/* {this.state.videoID ?
                (<iframe title="video-frame" id="video-feed-main" src={videoAddress} width="800" height="640" scrolling="auto" allow="microphone; camera" ></iframe>) 
                : null} */}
                </div>

                <div className="chat-box">
                    {/* {this.state.conversation_id ?
                    (
                    <ActionCableConsumer 
                    channel={{ channel: 'ConversationsChannel', conversation_id: this.state.conversation_id, user_id: this.props.user.id}}
                    onReceived={this.receivedMessageToChild}
                    onDisconnected={this.logIt}
                    />) : null} */}
                    
                    <ChatBox user={user} myLocation={myLocation} />

                    { chatting /*&& this.state.videoID */ ? <button onClick={stopChatting} >Stop Chatting</button> : <button onClick={startChatting}>Start Chatting</button>}
                </div>
            </div>
            <button className="chatroom-home-button" onClick={handleRerouteHome}>Back to Home</button>
        </div>
    )
}

const mapStateToProps = function(state) {
    const {Auth, Messages} = state
    return {
      user: Auth.user,
      signedIn: Auth.signedIn,
      myLocation: Auth.location,
      messages: Messages.messages,
    }
  }

  const mapDispatchToProps = {
      receiveUser: user => receiveUser(user),
  }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatRoom))