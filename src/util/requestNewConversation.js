const requestNewConversation = async (user) => {
    const obj = {user: user}
    const res = await fetch(`${process.env.REACT_APP_API_URL}conversations/find_open_room`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    const data = await res.json()
    console.log('conversationInfo', data)
    return data
}

export const reopenConversation = async (conversationId, userId) => {
    const obj = {conversation_id: conversationId, user_id: userId}
    await fetch(`${process.env.REACT_APP_API_URL}conversations/reopen`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
}

export const requestCredentials = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}conversations/credentials`)
    const data = await res.json()
    console.log('credentials', data.credentials)
    if (data.credentials){
        return data.credentials
    } else {
        throw new Error('no ice candidates. possible server issue')
    }
}


export default requestNewConversation