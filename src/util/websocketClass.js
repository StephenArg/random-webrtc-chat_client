export default class Socket {
    constructor(setSubscribedToConversationChannel, setOtherUsersInfo, setWebSocketEstablished, socketResponseTriggeredFunc) {
        this.socket = new WebSocket("ws://localhost:3000/cable")
        this.setSubscribedToConversationChannel = setSubscribedToConversationChannel;
        this.setOtherUsersInfo = setOtherUsersInfo;
        this.setWebSocketEstablished = setWebSocketEstablished
        this.socketResponseTriggeredFunc = socketResponseTriggeredFunc
        this.socket.onmessage = this.onMessage
        this.socket.onclose = this.onClose
        this.socket.onopen = this.onOpen
    }

    onMessage = (params) => {
        const data = JSON.parse(params.data)
        if (data.identifier) {
            const messageObj = data.message
            switch (messageObj?.action){
                case 'incoming_offer':
                    this.setOtherUsersInfo({name: messageObj.otherUsersName, location: messageObj.otherUsersLocation})
                    // console.log(`Incoming offer from ${messageObj.otherUsersName}: ${JSON.stringify(messageObj.offer)}`)
                    this.socketResponseTriggeredFunc('incoming_offer', messageObj)
                    break;
                case 'incoming_answer':
                    this.setOtherUsersInfo({name: messageObj.otherUsersName, location: messageObj.otherUsersLocation})
                    this.socketResponseTriggeredFunc('incoming_answer', messageObj)
                    break;
                case 'incoming_candidate':
                    this.socketResponseTriggeredFunc('incoming_candidate', messageObj)
                    break;
                case 'reopen_conversation':
                    this.socketResponseTriggeredFunc('reopen_conversation')
                    break;
                case 'incoming_message':
                    this.socketResponseTriggeredFunc('incoming_message', messageObj)
                    break;
                default:
                    if(JSON.parse(data.identifier).channel === 'ConversationChannel' && data.type === 'confirm_subscription') {
                        this.setSubscribedToConversationChannel(true)
                    }
            }
        }
    }

    onClose = (params) => {
        console.log("closed websocket")
    }

    onOpen = (params) => {
        console.log("open", params)
        this.setWebSocketEstablished(true)
    }

    subscribeToConversationChannel = (conversationInfo, user) => {
        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                channel: 'ConversationChannel',
                conversation_id: conversationInfo?.conversation_id,
                id: user?.id,
            }),
        };
        this.socket.send(JSON.stringify(msg));
    }

    unsubscribeFromConversationChannel = (conversationInfo, user) => {
        console.log('unsubscribing to ConversationsChannel')
        const msg = {
            command: 'unsubscribe',
            identifier: JSON.stringify({
                channel: 'ConversationChannel',
                conversation_id: conversationInfo?.conversation_id,
                id: user?.id,
            }),
        };
        this.socket.send(JSON.stringify(msg));
    }

    sendCommandToConversationChannel = (conversationInfo, user, action, payload) => {
        if (!payload.candidate){console.log(this.socket, conversationInfo, user, action, payload)}
        const msg = {
            command: 'message',
            identifier: JSON.stringify({
              channel: 'ConversationChannel',
              conversation_id: conversationInfo?.conversation_id,
              id: user?.id,
            }),
            data: JSON.stringify({
              action: action,
              conversation_info: conversationInfo,
              payload: payload
            }),
          };
        if (this.socket.readyState === 1) {
          this.socket.send(JSON.stringify(msg));
        }
    }

}