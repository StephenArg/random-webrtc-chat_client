import React, {useState} from 'react'
import { connect } from 'react-redux';
import { receiveUser } from '../StoreManagers/AuthManager';

function SignUp(props) {

    const {receiveUser} = props
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const canBeSubmitted = () => {
        return (
          email.length > 0 &&
          password.length > 0 &&
          name.length > 0
        );
      }

    const submitButtonActive = canBeSubmitted()

    const handleSubmit = (e) => {
        e.preventDefault()

        const user = {
            name, email, password
        }
        fetch(`${process.env.REACT_APP_API_URL}users/create`, {
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
        } else {
            console.log("Display signup error at some point")
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={name} onChange={(e) => setName(e.target.value)} name="name" type="text" placeholder="Name/Nickname"></input>
                <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="text" placeholder="Email"></input>
                <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" placeholder="Password"></input>
                <button disabled={!submitButtonActive} className="user-auth-button" type="submit">Submit</button>
            </form>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {receiveUser: user => dispatch(receiveUser(user)),}
  }

export default connect(null, mapDispatchToProps)(SignUp)