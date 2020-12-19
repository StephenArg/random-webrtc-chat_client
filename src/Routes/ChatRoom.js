/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import authenticateUser from '../util/authenticateUser'
import requestNewConversation, {requestCredentials, reopenConversation} from '../util/requestNewConversation'
import Socket from '../util/websocketClass'
import PeerConnection from '../util/peerConnectionClass'
import ChatBox from '../components/ChatBox'
import { receiveUser } from '../StoreManagers/AuthManager';
import { addMessage, increaseMessageIdCounter, resetMessages } from '../StoreManagers/MessagesManager'
import { updateScroll } from '../util/helperFunctions'
// yarn added @tensorflow/tfjs
// // const mobilenet = require('@tensorflow-models/mobilenet')
// const cocoSsd = require('@tensorflow-models/coco-ssd')

var pcConfig = {
    'iceServers': [{"urls": "stun:stun.l.google.com:19302"},
    {"urls":"turn:numb.viagenie.ca", "username":"webrtc@live.com", "credential":"muazkh"}]
  };
var constraints = { video: true, audio: true };
var localVideo;
var remoteVideo;
var socket;
var peerConnection;

function ChatRoom(props) {
    const {user, signedIn, myLocation, receiveUser, addMessage, resetMessages, increaseMessageIdCounter, messageIdCounter} = props
    const [chatting, setChatting] = useState(false)
    const [conversationInfo, setConversationInfo] = useState(null)
    const [otherUsersInfo, setOtherUsersInfo] = useState({name: "N/A", location: "N/A"})
    const [websocketEstablished, setWebSocketEstablished] = useState(false)
    const [subscribedToConversationChannel, setSubscribedToConversationChannel] = useState(false)
    const [startOrStopChattingButtonEnabled, setStartOrStopChattingButtonEnabled] = useState(false)
    const [videoOverlay, setVideoOverlay] = useState(false)

    useEffect(() => {
        if (!signedIn){
          authenticateUser(props.history).then((user) => receiveUser(user))
        }
        var intervalCode;
        // var intervalModel;
        const asyncFuncWithinUseEffect = async () => {
            try{
                pcConfig['iceServers'] = await requestCredentials()
            } catch (error) {
                console.error(error)
            }
            socket = new Socket(setSubscribedToConversationChannel, setOtherUsersInfo, setWebSocketEstablished, socketResponseTriggeredFunc)
            setStartOrStopChattingButtonEnabled(true)

            intervalCode = setInterval(async () => {
                if(peerConnection){
                    try {
                        peerConnection.pcConfig['iceServers'] = await requestCredentials()
                    } catch (error) {
                        console.error(error)
                    }
                }
                // interval currently at 60 seconds, ideally it should be 30 minutes.
            }, 60000)
            

            // intervalModel = setInterval(async () => {
            //     console.log("scanning...");
            //     const vid = document.getElementById('myVideo');
            //     const model = await cocoSsd.load();
            //     const result = await model.detect(vid);
            //     console.log(result);
            // }, 5000)
            // // intervalModel is setting interval to run ML model on video feed
            
        }
        asyncFuncWithinUseEffect()

        return () => {
            clearInterval(intervalCode)
            // clearInterval(intervalModel)
            try{
                socket.socket.close()
                peerConnection.pc.close()
            } catch {
                console.error('No socket or peerConnection')
            } finally {
                resetMessages()
                setOtherUsersInfo({name: "N/A", location: "N/A"})
                setSubscribedToConversationChannel(false)
            }
        }
    }, [])

    useEffect(() => {
        async function asyncSetMyStream() {
            const myStream = await navigator.mediaDevices.getUserMedia(constraints);
            peerConnection = new PeerConnection(myStream, pcConfig, props.history)
            intializeLocalElementStream(peerConnection.myStream)
        }
        if (user) {asyncSetMyStream()}
    }, [user])

    useEffect(() => {
        console.log('chatting', user, chatting)
        if (user && chatting) {
            const asyncFuncWithinUseEffect = async () => {
                setConversationInfo(await requestNewConversation(user))
            }
            asyncFuncWithinUseEffect()
        }
    }, [chatting])

    useEffect(() => {
        if (websocketEstablished && conversationInfo && user) {
            console.log('subscribeToConversationChannel useEffect')
            socket.socketResponseTriggeredFunc = socketResponseTriggeredFunc
            socket.subscribeToConversationChannel(conversationInfo, user)
        }
    }, [websocketEstablished, conversationInfo])

    useEffect(() => {
        const asyncFuncWithinUseEffect = async () => {
            if (websocketEstablished && subscribedToConversationChannel && conversationInfo && conversationInfo.make_offer && user && myLocation) {
                console.log('make offer')
                peerConnection.createNewPeerConnection(intializeRemoteElementStream, peerConnectionResponseTriggeredFunc)
                try {
                    const offer = await peerConnection.generateOffer()
                    sendThroughWebsocket('offer_to_user', {offer: offer, otherUsersLocation: myLocation, otherUsersName: user.name})
                } catch {
                    console.error('Error making Offer')
                }

            } else {
                console.log('don\'t send offer')
            }
        }
        asyncFuncWithinUseEffect()
    }, [subscribedToConversationChannel, myLocation, conversationInfo])

    useEffect(() => {
        // Resets state closure values within socketResponseTriggeredFunc when they change in the outer scope
        if(socket) {
            socket.socketResponseTriggeredFunc = socketResponseTriggeredFunc
        }
    }, [messageIdCounter, otherUsersInfo])


    const sendThroughWebsocket = (action, payload) => {
        socket.sendCommandToConversationChannel(conversationInfo, user, action, payload)
    }

    const intializeLocalElementStream = (myStream) => {
        localVideo = document.getElementById('myVideo'); 
        if (localVideo) {
            localVideo.width = 400
            localVideo.muted = true
            try {
                localVideo.srcObject = myStream;
            } catch (error) {
                localVideo.src = window.URL.createObjectURL(myStream);
            }
        }
        // setReadyToInitialize(true)
    }

    const intializeRemoteElementStream = (event) => {
        remoteVideo = document.getElementById('theirVideo'); 
        if (remoteVideo) {
            remoteVideo.width = 400
            remoteVideo.muted = true
            try {
                remoteVideo.srcObject = event.streams[0];
            } catch (error) {
                remoteVideo.src = window.URL.createObjectURL(event.streams[0]);
            }
        }
        // setReadyToInitialize(true)
    }

    const socketResponseTriggeredFunc = async (command, payload) => {
        console.log('within socketResponseTriggeredFunc', user, conversationInfo)
        switch (command) {
            case 'incoming_offer':
                peerConnection.createNewPeerConnection(intializeRemoteElementStream, peerConnectionResponseTriggeredFunc, payload.offer)
                try {
                    const answer = await peerConnection.generateAnswer()
                    sendThroughWebsocket('answer_to_user', {answer: answer, otherUsersLocation: myLocation, otherUsersName: user.name})
                } catch {
                    console.error('Error making Answer')
                }
                break;
            case 'incoming_answer':
                console.log(payload)
                if(peerConnection.pc && peerConnection.pc.signalingState !== 'stable') {
                    peerConnection.pc.setRemoteDescription(payload.answer)
                    if (!peerConnection.allowRenegotiation) {peerConnection.allowRenegotiation = true}
                }
                break;
            case 'incoming_candidate':
                if (peerConnection.pc &&
                     ((peerConnection.pc.signalingState && peerConnection.pc.signalingState !== 'closed') ||
                      (peerConnection.pc.connectionState && peerConnection.pc.connectionState !== 'closed'))) {
                    console.log('incoming_candidate', peerConnection.pc, payload.candidate)
                    try{
                        peerConnection.pc.addIceCandidate(new RTCIceCandidate(payload.candidate))
                    } catch(e) {
                        console.error('Error with peerConnection', e)
                    }

                }
                break;
            case 'reopen_conversation':
                resetAllVariables()
                console.log('reopening')
                reopenConversation(conversationInfo.conversation_id, user.id)
                break;
            case 'incoming_message':
                console.log('message:', payload.message)
                const d = new Date();
                const time = d.toLocaleTimeString();
                addMessage({id: messageIdCounter, name: otherUsersInfo.name, content: payload.message, time: time, otherUser: true })
                increaseMessageIdCounter()
                updateScroll()
                break;
            default:
                console.log('No command')
        }
    }

    const peerConnectionResponseTriggeredFunc = async (command, payload) => {
        // console.log('peerConnectionResponseTriggeredFunc', conversationInfo)
        switch(command) {
            case 'send_candidate':
                //This [was] breaking. Kept saying conversation info is null for the answerer (This note was before the switch to peerConnection class)
                sendThroughWebsocket('candidate', payload)
                break;
            case 'on_negotiation':
                try {
                    const offer = await peerConnection.generateOffer(true)
                    sendThroughWebsocket('offer_to_user', {offer: offer, otherUsersLocation: myLocation, otherUsersName: user?.name})
                } catch {
                    console.error('Error generating negotiation')
                }
                break;
            default:
                console.log('No command')
        }
    }

    const handleSubmitMessage = (message) => {
        sendThroughWebsocket('message', {message: message})
    }

    const handleRerouteHome = () => {
        try {
            const tracks = peerConnection.myStream.getTracks();
            tracks.forEach(function(track) {
                track.stop()
                peerConnection.myStream.removeTrack(track)
            });
            peerConnection.myStream = null
            socket.close()
        } catch {
            console.error('Error closing service while rerouting to homepage')
        }
        props.history.push('/')
    }

    const startChatting = () => {
        console.log('startChatting1')
        if (startOrStopChattingButtonEnabled) {
            console.log('startChatting2')
            setStartOrStopChattingButtonEnabled(false)
            resetMessages()
            setChatting(true)
            setTimeout(() => {
                setStartOrStopChattingButtonEnabled(true)
            }, 2000)
        }
    }

    const stopChatting = () => {
        if (startOrStopChattingButtonEnabled) {
            console.log('stopChatting')
            setStartOrStopChattingButtonEnabled(false)
            if(socket.socket){socket.unsubscribeFromConversationChannel(conversationInfo, user)}
            if(peerConnection.pc){peerConnection.pc.close()}
            setConversationInfo(null)
            resetAllVariables()
            setSubscribedToConversationChannel(false)
            setChatting(false)
            setTimeout(() => {
                setStartOrStopChattingButtonEnabled(true)
            }, 2000)
        }
    }

    const resetAllVariables = () => {
        remoteVideo = document.getElementById('theirVideo'); 
        if(remoteVideo) {
            try {
                remoteVideo.srcObject = null;
            } catch (error) {
                remoteVideo.src = null;
            }
        }
        resetMessages()
        setOtherUsersInfo({name: "N/A", location: "N/A"})
    }

    const handleTest = async () => {
        console.log('test pc',peerConnection ,peerConnection.pc, await peerConnection.handleNegotiation())
    }

    if(!user){
        return(<h1>Loading...</h1>)
    }
    
    return (
        <div>
            <div className="chatroom-container">
                <div className="video-frame" >
                    <video id="myVideo"
                        className={videoOverlay ? "myVideoOverlay videoFeed" : "videoFeed"}
                        poster={process.env.PUBLIC_URL + 'loading.gif'}
                        onClick={()=>setVideoOverlay(!videoOverlay)}
                        autoPlay>
                    </video>
                    <br type="block"/>
                    <video id="theirVideo"
                        className={videoOverlay ? "theirVideoOverlay videoFeed" : "videoFeed"}
                        poster={process.env.PUBLIC_URL + 'loading.gif'}
                        onClick={()=>setVideoOverlay(!videoOverlay)}
                        autoPlay>    
                    </video>
                </div>

                <div className="chat-box">
                    <ChatBox user={user} myLocation={myLocation} otherUsersInfo={otherUsersInfo}
                        handleSubmitMessage={handleSubmitMessage} chatting={chatting}
                        stopChatting={stopChatting} startChatting={startChatting}
                        handleTest={handleTest} startOrStopChattingButtonEnabled={startOrStopChattingButtonEnabled} />
                    <br type="block"/>
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
      messageIdCounter: Messages.messageIdCounter
    }
  }

  const mapDispatchToProps = {
      receiveUser: user => receiveUser(user),
      addMessage: message => addMessage(message),
      increaseMessageIdCounter: () => increaseMessageIdCounter(),
      resetMessages: resetMessages,
  }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatRoom))