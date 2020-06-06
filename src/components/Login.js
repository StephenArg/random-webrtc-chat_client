import React, {useState} from 'react'
import { connect } from 'react-redux';
import {receiveUser} from '../storeManagers/AuthManager'

function Login(props) {
    
    const {receiveUser} = props
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const canBeSubmitted = () => {
        return (
          email.length > 0 &&
          password.length > 0
        );
      }
    
    const submitButtonActive = canBeSubmitted()

    const handleSubmit = (e) => {
        e.preventDefault()

        const user = {
            email, password
        }
        fetch('http://localhost:3000/users/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }).then(res => res.json())
        .then(setLocalStorage)
    }

    const setLocalStorage = (res) => {
        if (!res.error) {
            localStorage.setItem("token", res.jwt)
            // redux dispatch for user object
            receiveUser(res.user)
            // setLoggedIn(true)
        } else {
            console.log("Display login error at some point")
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="text" placeholder="Email"></input>
                <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" placeholder="Password"></input>
                <button disabled={!submitButtonActive} className="user-auth-button" type="submit" >Login</button>
            </form>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {receiveUser: user => dispatch(receiveUser(user)),}
  }

export default connect(null, mapDispatchToProps)(Login)