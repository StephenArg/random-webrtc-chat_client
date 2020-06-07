export const createNewPeerConnection = (peerConnection, myStream, streamSenders, pcConfig, intializeRemoteElementStream, peerConnectionResponseTriggeredFunc, offer) => {
    peerConnection = new RTCPeerConnection(pcConfig)
    myStream.getTracks().forEach((track) => {
        let sender = peerConnection.addTrack(track, myStream)
        streamSenders.push(sender)
    })
    // dataChannel = peerConnection.createDataChannel('text', {
    //     ordered: true, // guarantees order
    //     maxPacketLifeTime: 3000
    //     })
    // dataChannel.onopen = () => {console.log("DataChannel Open")}
    // dataChannel.onmessage = dataChannelMessage
    if (offer) {peerConnection.setRemoteDescription(offer)}
    peerConnection.ontrack = intializeRemoteElementStream
    peerConnection.onicecandidate = (event) => sendIceCandidate(event, peerConnectionResponseTriggeredFunc)
    peerConnection.onnegotiationneeded = (event) => handleNegotiation(event, peerConnectionResponseTriggeredFunc)
    return peerConnection
}

export const generateOffer = async (peerConnection, renegotiation = false) => {
    // let action = 'offer_to_user'
        // if (renegotiation) {
        //     socketRoute = 'renegotiation_offer_to_user'
        // } else if (!renegotiation) {
        //     socketRoute = 'offer_to_user'
        // }

        // console.log("genOffer", renegotiation, allowRenegotionationOutsideVar, socketRoute)

    // if (action) {
    const offer = await peerConnection.createOffer()
    peerConnection.setLocalDescription(offer)
    return offer
    // socket.emit(action, {
    //     offer: offer,
    //     location: myLocation
    // })
    // }       
}

export const generateAnswer = async (peerConnection, renegotiation = false) => {
    // let action
    // if (renegotiation && allowRenegotionationOutsideVar) {
    //     action = 'renegotiation_answer_to_user'
    // } else if (!renegotiation) {
    //     action = 'answer_to_user'
    // }

    // if (action) {
    const answer = await peerConnection.createAnswer()
    peerConnection.setLocalDescription(answer)
    return answer
        // socket.emit(action, {
        //     answer: answer,
        // })
        // document.getElementById('yourID').value = JSON.stringify(answer)
    // })
        // setTimeout(() => {
        //     setAllowRenegotiation(true)
        // }, 3000)
    // }
} 

// const receivedStream = (event, remoteVideo) => {
//     remoteVideo = document.getElementById('theirVideo')
//     remoteVideo.width = 400
//     remoteVideo.muted = true

//     console.log(event, remoteVideo.srcObject)
//     try {
//         remoteVideo.srcObject = event.streams[0];
//     } catch (error) {
//         remoteVideo.src = window.URL.createObjectURL(event.streams[0]);
//     }
// }

const sendIceCandidate = (event, peerConnectionResponseTriggeredFunc) => {
    if (event.candidate) {
        // console.log(event.candidate)
        peerConnectionResponseTriggeredFunc('send_candidate', {candidate: event.candidate})
    }
}

const handleNegotiation = async (event, peerConnectionResponseTriggeredFunc) => {
    console.log("here", event)
    // setTimeout(() => {
    //   peerConnectionResponseTriggeredFunc('on_negotiation')  
    // },10000)
    
    // generateOffer(true, event)
}