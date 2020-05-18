import React, {useEffect} from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Route, Link, HashRouter as Router, Switch } from 'react-router-dom'
import {signIn, signOut, requestLocationData, setBrowserHistory} from './StoreManagers/AuthManager'
import HomePage from './Routes/HomePage'
import Settings from './Routes/Settings'
import ChatRoom from './Routes/ChatRoom'
import data from './mockDB/what.json'

function App(props) {

  useEffect(() => {
    props.setBrowserHistory(props.browserHistory)
    console.log(data)
    // if (true) {
    //   console.log(props.history)
    //   props.history.push("/#") // What does history do? It currently pushing the string to the end of the pathname
    // }
    // console.log('props', props)
    // props.requestLocationData()
    // // eslint-disable-next-line
  }, [])

  // const signIn = () => {props.signIn()}
  // const signOut = () => {props.signOut()}

  return (
    <Router>
      <div className="App">
        {/* <button onClick={signIn}>Sign In</button>
        <button onClick={signOut}>Sign Out</button> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/settings" component={Settings} />
          <Route path="/chat" component={ChatRoom} />
        </Switch>
      </div>
    </Router>
  );
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

const mapDispatchToProps = {
  requestLocationData: requestLocationData,
  signIn: signIn,
  signOut: signOut,
  setBrowserHistory: setBrowserHistory, 
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
