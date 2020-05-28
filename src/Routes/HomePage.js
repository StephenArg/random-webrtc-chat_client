import React from 'react'
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom'

function HomePage(props) {

    const handleClick = () => {
        // withRouter puts history into props
        props.history.push('/chat')
    }

    return (
        <div className="homepage-container" >
           <div className="homepage-menu"> 
            <h1>Hi</h1>
            <button onClick={handleClick}>chat</button>
           </div>
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
    }
  }


export default connect(mapStateToProps)(withRouter(HomePage))