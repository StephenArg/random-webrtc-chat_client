export const onMessage = (params, socketResponseTriggeredFunc, setSubscribedToConversationChannel, setOtherUsersInfo) => {
    const data = JSON.parse(params.data)
    if (data.identifier) {
        const messageObj = data.message
        switch (messageObj?.action){
            case 'incoming_offer':
                setOtherUsersInfo({name: messageObj.otherUsersName, location: messageObj.otherUsersLocation})
                // console.log(`Incoming offer from ${messageObj.otherUsersName}: ${JSON.stringify(messageObj.offer)}`)
                socketResponseTriggeredFunc('incoming_offer', messageObj)
                break;
            case 'incoming_answer':
                setOtherUsersInfo({name: messageObj.otherUsersName, location: messageObj.otherUsersLocation})
                socketResponseTriggeredFunc('incoming_answer', messageObj)
                break;
            case 'incoming_candidate':
                socketResponseTriggeredFunc('incoming_candidate', messageObj)
                break;
            case 'reopen_conversation':
                socketResponseTriggeredFunc('reopen_conversation')
                break;
            case 'incoming_message':
                socketResponseTriggeredFunc('incoming_message', messageObj)
                break;
            default:
                if(JSON.parse(data.identifier).channel === 'ConversationChannel' && data.type === 'confirm_subscription') {
                    setSubscribedToConversationChannel(true)
                }
        }
    }
}

export const onClose = (params) => {
    console.log("closed websocket")
}

export const onOpen = (params, setWebSocketEstablished) => {
    console.log("open", params)
    setWebSocketEstablished(true)
}

export const subscribeToConversationChannel = (socket, conversationInfo, user) => {
    const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
            channel: 'ConversationChannel',
            conversation_id: conversationInfo?.conversation_id,
            id: user?.id,
        }),
    };
    socket.send(JSON.stringify(msg));
}

export const unsubscribeFromConversationChannel = (socket, conversationInfo, user) => {
    console.log('unsubscribing to ConversationsChannel')
    const msg = {
        command: 'unsubscribe',
        identifier: JSON.stringify({
            channel: 'ConversationChannel',
            conversation_id: conversationInfo?.conversation_id,
            id: user?.id,
        }),
    };
    socket.send(JSON.stringify(msg));
}

export const sendCommandToConversationChannel = (socket, conversationInfo, user, action, payload) => {
    if (!payload.candidate){console.log(socket, conversationInfo, user, action, payload)}
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
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(msg));
    }
}