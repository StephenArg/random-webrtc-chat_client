export const onMessage = (params, setSubscribedToConversationChannel) => {
    const data = JSON.parse(params.data)

    if(data.identifier && JSON.parse(data.identifier).channel === 'ConversationChannel' && data.type === 'confirm_subscription') {
        setSubscribedToConversationChannel(true)
    }

    console.log("message", data)


}

export const onClose = (params) => {
    console.log("close", params)
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
            conversation_id: conversationInfo.conversation_id,
            id: user.id,
        }),
    };
    socket.send(JSON.stringify(msg));
}

export const sendCommandToConversationChannel = (socket, conversationInfo, user, action, payload) => {
    console.log(socket, conversationInfo, user, action, payload)
    const msg = {
        command: 'message',
        identifier: JSON.stringify({
          channel: 'ConversationChannel',
          conversation_id: conversationInfo.conversation_id,
          id: user.id,
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