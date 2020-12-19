const authenticateUser = async (history) => {
    if (localStorage.getItem('token')) {
        const obj = {jwt: localStorage.getItem('token')}
        return await handlePostCall(obj, history)
      } else {
          history.push('/')
      }
}

const handlePostCall = async (obj, history) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}users/authenticate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    const data = await res.json()
    return handleAuthResult(data, history)
}

const handleAuthResult = (res, history) => {
    if (res.err) {
        localStorage.removeItem('token')
        history.push('/')
    } else {
        console.log(res)
        return res.user
    }
}

export default authenticateUser