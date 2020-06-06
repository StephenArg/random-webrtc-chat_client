const requestNewConversation = async (user) => {
    const obj = {user: user}
    const res = await fetch('http://localhost:3000/conversations/find_open_room', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    const data = await res.json()
    return data
}

export default requestNewConversation