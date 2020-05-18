import React from 'react'
import { connect } from 'react-redux';

function HomePage(props) {

    const handleClick = () => {
        props.history.push('/chat')
    }

    return (
        <div>
           <h1>Hi</h1>
           <button onClick={handleClick}>chat</button>
        </div>
    )
}

const mapStateToProps = function(state) {
    const {Auth, Messages} = state
    return {
      email: Auth.email,
      signedIn: Auth.signedIn,
      location: Auth.location,
      messages: Messages.messages,
      history: Auth.history,
    }
  }


export default connect(mapStateToProps)(HomePage)