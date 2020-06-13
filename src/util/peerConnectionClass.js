export default class PeerConnection {
    constructor(myStream, pcConfig, history){
        // this.peerConnection = new RTCPeerConnection()
        this.myStream = myStream
        this.pcConfig = pcConfig
        this.streamSenders = []
        this.history = history
        this.allowRenegotiation = false
    }

    createNewPeerConnection = (intializeRemoteElementStream, peerConnectionResponseTriggeredFunc, offer) => {
        console.log('pcCongfig', this.pcConfig)
        this.peerConnectionResponseTriggeredFunc = peerConnectionResponseTriggeredFunc
        this.pc = new RTCPeerConnection(this.pcConfig)
        if (offer) {this.pc.setRemoteDescription(offer)}
        // setRemoteDescription() needs to receive offer before setting track or onnegotiationneeded will trigger too quickly
        // doesn't prevent issue on chrome. chrome requires tracking when negotioation can begin with allowRenegotiation value
        this.myStream.getTracks().forEach((track) => {
            let sender = this.pc.addTrack(track, this.myStream)
            this.streamSenders.push(sender)
        })
        this.pc.ontrack = intializeRemoteElementStream
        this.pc.onicecandidate = this.sendIceCandidate
        this.pc.onnegotiationneeded = this.handleNegotiation
        console.log('pc', this.pc)
    }

    generateOffer = async (renegotiation = false) => {
        this.isPCClosed()
        try {
            const offer = await this.pc.createOffer()
            this.pc.setLocalDescription(offer)
            return offer     
        } catch {
            console.error('Error generating Offer')
        }
    }

    generateAnswer = async (renegotiation = false) => {
        this.isPCClosed()
        try {
            const answer = await this.pc.createAnswer()
            this.pc.setLocalDescription(answer)
            if (!this.allowRenegotiation) {this.allowRenegotiation = true}
            return answer
        } catch {
            console.error('Error generating Answer')
        }
    } 

    sendIceCandidate = (event) => {
        this.isPCClosed()
        if (event.candidate) {
            // console.log(event.candidate)
            this.peerConnectionResponseTriggeredFunc('send_candidate', {candidate: event.candidate})
        }
    }
    
    handleNegotiation = async (event) => {
        if (this.allowRenegotiation) {
            console.log("here", event)
        }
        // setTimeout(() => {
        //   peerConnectionResponseTriggeredFunc('on_negotiation')  
        // },10000)
        
        // generateOffer(true, event)
    }

    isPCClosed = () => {
        if (!(this.pc &&
            ((this.pc.signalingState && this.pc.signalingState !== 'closed') ||
             (this.pc.connectionState && this.pc.connectionState !== 'closed')))) {
                 this.history.push('/')
             }
    }

}