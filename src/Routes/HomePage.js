import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux';
import UserAuth from '../containers/UserAuth'
import MainMenu from '../containers/MainMenu'
import {withRouter} from 'react-router-dom'
import { receiveUser, signOut } from '../StoreManagers/AuthManager';

function HomePage(props) {

    const { signedIn, receiveUser } = props
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
      // Show loading screen before login page. If there's no token,
      // or there's an error authenticating the token load the signup component
      if (!signedIn && localStorage.getItem('token')) {
        const obj = {jwt: localStorage.getItem('token')}
  
        fetch(`${process.env.REACT_APP_API_URL}users/authenticate`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(obj)
          }).then(res => res.json())
          .then(handleAuthenticationResult)
      } else {
        setAuthChecked(true)
      }
    }, [])

    const handleAuthenticationResult = (res) => {
      if (!res.error) {
        receiveUser(res.user)
        setAuthChecked(true)
    } else {
        console.log("Display authentication error at some point")
        setAuthChecked(true)
    }
    }

    // const handleClick = () => {
    //     // withRouter puts history into props
    //     props.history.push('/chat')
    // }

    return (
        <div className="homepage-container" >
          <div className="inner-container" >
          { !authChecked ? <h1>Loading...</h1> : signedIn ?
            <MainMenu /> :
            <UserAuth />
           }
          </div>
        </div>
    )
}

const mapStateToProps = function(state) {
    const {Auth, Messages} = state
    return {
      user: Auth.user,
      signedIn: Auth.signedIn,
      location: Auth.location,
      messages: Messages.messages,
    }
  }

  const mapDispatchToProps = {
      receiveUser: user => receiveUser(user),
      signOut: signOut,
  }


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage))