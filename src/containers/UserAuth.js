import React, {useState, useEffect} from 'react'
import SignUp from '../components/SignUp'
import Login from '../components/Login'

export default function UserAuth() {

    const [showLogin, setShowLogin] = useState(false)

    useEffect(() => {
        // setTimeout(() => {
        //     setShowLogin(true)
        // }, 7000)
    }, [])

    const handleSwitchToLogin = () => {
        setShowLogin(!showLogin)
    }

    return (
        <div className="user-auth">
            <div className="user-auth-text-container" >
                <h2 className="user-auth-h2" align="left" >Chat with random people from around the world on AccessRandom.</h2>
                <div className="user-auth-div-explain">
                    <span className="user-auth-span-explain" >Conversate with interesting humans! The more you chat the better the experience gets.</span>
                </div>
                <div className="user-auth-div-explain">
                    <span className="user-auth-span-explain" >Message people you lose connection with to make #missing-connections a thing of the past!</span>
                </div>
            </div>
            <div className="user-auth-form-container">
                {showLogin ? 
                <div>
                    <h2 className="user-auth-form-text-h2" align="left">Log In</h2>
                    <div className="user-auth-form-text" align="left">Welcome Back! Or did you want to <span className="login-switch-span" onClick={handleSwitchToLogin}>sign up</span>?</div>
                </div> : 
                <div>
                    <h2 className="user-auth-form-text-h2" align="left">Sign Up</h2>
                    <div className="user-auth-form-text" align="left">It's quick and simple. Want to <span className="login-switch-span" onClick={handleSwitchToLogin}>log in</span> instead?</div>
                </div>}
                <div className="user-auth-form">
                    {showLogin ? <Login /> : <SignUp />}
                </div>
            </div>
        </div>
    )
}
