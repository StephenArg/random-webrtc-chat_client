/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import authenticateUser from '../util/authenticateUser'
import requestNewConversation, {requestCredentials} from '../util/requestNewConversation'
import {onMessage, onOpen, onClose, subscribeToConversationChannel, unsubscribeFromConversationChannel, sendCommandToConversationChannel} from '../util/websocketFunctions'
import {createNewPeerConnection, generateOffer, generateAnswer} from '../util/peerConnectionFunctions'
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
var peerConnection;
var streamSenders = [];

function ChatRoom(props) {
    const {user, signedIn, myLocation, receiveUser} = props
    const [chatting, setChatting] = useState(false)
    const [conversationInfo, setConversationInfo] = useState(null)
    const [otherUsersInfo, setOtherUsersInfo] = useState({name: "N/A", location: "N/A"})
    const [websocketEstablished, setWebsocketEstablished] = useState(false)
    const [subscribedToConversationChannel, setSubscribedToConversationChannel] = useState(false)
    const [receivedOffer, setReceivedOffer] = useState(false)
    const [receivedOfferWithNoUserOrConversation, setReceivedOfferWithNoUserOrConversation] = useState(null)

    useEffect(() => {
        if (!signedIn){
          authenticateUser(props.history).then((user) => receiveUser(user))
        }
        var intervalCode;
        const asyncFuncWithinUseEffect = async () => {
            pcConfig['iceServers'] = await requestCredentials()
            socket = new WebSocket("ws://localhost:3000/cable")
            socket.onmessage = (params) => onMessage(params, socketResponseTriggeredFunc, setSubscribedToConversationChannel, setOtherUsersInfo)
            socket.onclose = onClose
            socket.onopen = (params) => onOpen(params, setWebsocketEstablished)

            intervalCode = setInterval(async () => {
                pcConfig['iceServers'] = await requestCredentials()
            }, 30000)
        }
        asyncFuncWithinUseEffect()

        return () => {
            clearInterval(intervalCode)
        }
    }, [])

    useEffect(() => {
        async function asyncSetMyStream() {
            myStream = await navigator.mediaDevices.getUserMedia(constraints);
            intializeLocalElementStream()
            // intializeRemoteElementStream()
        }
        if (user) {asyncSetMyStream()}
    }, [user])

    useEffect(() => {
        if (chatting) {
            const asyncFuncWithinUseEffect = async () => {
                setConversationInfo(await requestNewConversation(user))
            }
            asyncFuncWithinUseEffect()
        }
    }, [chatting])

    useEffect(() => {
        if (websocketEstablished && conversationInfo) {
            subscribeToConversationChannel(socket, conversationInfo, user)
        }
    }, [websocketEstablished, conversationInfo])

    useEffect(() => {
        const asyncFuncWithinUseEffect = async () => {
            if (websocketEstablished && subscribedToConversationChannel && conversationInfo && conversationInfo.make_offer && user && myLocation) {
                console.log('make offer')
                peerConnection = createPeerConnection()
                const offer = await generateOffer(peerConnection)
                sendThroughWebsocket('offer_to_user', {offer: offer, otherUsersLocation: myLocation, otherUsersName: user.name})
            } else {
                console.log('don\'t send offer')
            }
        }
        asyncFuncWithinUseEffect()
    }, [subscribedToConversationChannel, myLocation])

    useEffect(() => {
        if (receivedOfferWithNoUserOrConversation && user && conversationInfo) {
            peerConnection = createPeerConnection(receivedOfferWithNoUserOrConversation)
            setReceivedOfferWithNoUserOrConversation(false)
            setReceivedOffer(true)
        }
    }, [receivedOfferWithNoUserOrConversation, user, conversationInfo])

    useEffect(() => {
        if(receivedOffer && user && conversationInfo) {
            const asyncFuncWithinUseEffect = async () => {
                const answer = await generateAnswer(peerConnection)
                sendThroughWebsocket('answer_to_user', {answer: answer, otherUsersLocation: myLocation, otherUsersName: user.name})
                setReceivedOffer(false)
            }  
            asyncFuncWithinUseEffect()
        }
    }, [receivedOffer, conversationInfo])

    const sendThroughWebsocket = (action, payload) => {
        sendCommandToConversationChannel(socket, conversationInfo, user, action, payload)
    }

    const createPeerConnection = (offer) => {
        return createNewPeerConnection(peerConnection, myStream, streamSenders, pcConfig, intializeRemoteElementStream, peerConnectionResponseTriggeredFunc, offer)
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

    const intializeRemoteElementStream = (event) => {
        remoteVideo = document.getElementById('theirVideo'); 
        remoteVideo.width = 400
        remoteVideo.muted = true
         try {
            remoteVideo.srcObject = event.streams[0];
        } catch (error) {
            remoteVideo.src = window.URL.createObjectURL(event.streams[0]);
        }
        // setReadyToInitialize(true)
    }

    const socketResponseTriggeredFunc = async (command, payload) => {
        switch (command) {
            case 'incoming_offer':
                if (!user || !conversationInfo) {
                    console.log('doing it')
                    setReceivedOfferWithNoUserOrConversation(payload.offer)
                } else {
                    peerConnection = createPeerConnection(payload.offer)
                    setReceivedOffer(true)
                }
                break;
            case 'incoming_answer':
                console.log(payload)
                peerConnection.setRemoteDescription(payload.answer)
                // setSendIceCandidates(true)
                break;
            case 'incoming_candidate':
                if (peerConnection) {
                    console.log(payload.candidate)
                    peerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate))
                }
                break;
            case 'reopen_conversation':
                resetAllVariables()
                break;
            default:
                console.log('No command')
        }
    }

    const peerConnectionResponseTriggeredFunc = async (command, payload) => {
        // console.log('peerConnectionResponseTriggeredFunc', conversationInfo)
        switch(command) {
            case 'send_candidate':
                //This is breaking. Keeps saying conversation info is null for the answerer
                sendThroughWebsocket('candidate', payload)
                break;
            case 'on_negotiation':
                const offer = await generateOffer(peerConnection)
                sendThroughWebsocket('offer_to_user', {offer: offer, otherUsersLocation: myLocation, otherUsersName: user?.name})
                break;
            default:
                console.log('No command')
        }
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
        setChatting(true)
        
    }

    const stopChatting = () => {
        unsubscribeFromConversationChannel(socket, conversationInfo, user)
        peerConnection.close()
        peerConnection = null
        setConversationInfo(null)
        resetAllVariables()
        setChatting(false)
    }

    const resetAllVariables = () => {
        try {
            remoteVideo.srcObject = null;
        } catch (error) {
            remoteVideo.src = null;
        }
        setOtherUsersInfo({name: "N/A", location: "N/A"})
        setSubscribedToConversationChannel(false)
        // unsubscribe from ConversationChannel
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
                    
                    <ChatBox user={user} myLocation={myLocation} otherUsersInfo={otherUsersInfo} />

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