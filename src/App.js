import React, {useEffect} from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import {signOut, requestLocationData} from './StoreManagers/AuthManager'
import HomePage from './Routes/HomePage'
import Settings from './Routes/Settings'
import ChatRoom from './Routes/ChatRoom'
// import ChatRoom from './Routes/ChatRoomSocketFunc'
// import ChatRoom from './Routes/ChatRoomPCFunc'
import Connections from './Routes/Connections'
// import data from './mockDB/what.json'

function App(props) {

  useEffect(() => {
    // props.setBrowserHistory(props.browserHistory)
    props.requestLocationData()
  }, [])

  return (
    <Router>
      <div className="App">
        <header>
          <h1 className="App-header" style={{marginBottom: 0}} >WebRTC Random Chat</h1>
        </header>
        {/* <button onClick={signIn}>Sign In</button>
        <button onClick={signOut}>Sign Out</button> */}
        <div className="App-body">
          <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/settings" component={Settings} />
          <Route path="/chat" component={ChatRoom} />
          <Route path="/connections" component={Connections} />
        </Switch>
        </div>
      </div>
    </Router>
  );
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
  requestLocationData: requestLocationData,
  signOut: signOut,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
