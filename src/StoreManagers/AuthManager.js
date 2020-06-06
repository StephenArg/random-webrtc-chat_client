// eslint-disable-next-line
import {all, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
// import authenticateUser from '../util/authenticateUser'

// Constants
const RECEIVE_USER = 'RECEIVE_USER';
const SIGN_OUT = 'SIGN_OUT'
// const REQUEST_AUTHENTICATE_USER = 'REQUEST_AUTHENTICATE_USER'
// const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR'
const REQUEST_LOCATION_DATA = 'REQUEST_LOCATION_DATA'
const RECEIVE_LOCATION_DATA = 'RECEIVE_LOCATION_DATA'
const SET_BROWSER_HISTORY = 'SET_BROWSER_HISTORY'


// Action Creators
export function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    user: user,
  };
}

export function signOut() {
    return {
        type: SIGN_OUT,
    };
}

// export function requestAuthenticateUser(){
//   return {
//     type: REQUEST_AUTHENTICATE_USER
//   };
// }

export function requestLocationData() {
    return {
        type: REQUEST_LOCATION_DATA,
    };
}

export function receiveLocationData(location) {
    return {
        type: RECEIVE_LOCATION_DATA,
        location: location
    };
}

export function setBrowserHistory(history) {
    return {
        type: SET_BROWSER_HISTORY,
        history: history
    };
}


// Sagas

async function fetchLocationData() {
    try {
        return await fetch("https://geolocation-db.com/json/")
        .then(res => res.json())
        .then(data => {return data.state ? `${data.state}, ${data.country_name}` : `${data.country_name}`})
    } catch {
        return "N/A"
    }
}

function* locationData() {
    const data = yield call(fetchLocationData)
    yield put(receiveLocationData(data))
}

// function* requestAuthentification() {
//   const data = yield call(authenticateUser)

//   if (!data.err) {
//     yield put(receiveUser(data))
//   }
// }

export function* authRootSaga() {
    yield takeEvery(REQUEST_LOCATION_DATA, locationData)
    // yield takeLatest(REQUEST_AUTHENTICATE_USER, requestAuthentification)
}

// Reducer

const initialState = {
    user: null,
    signedIn: false,
    location: "",
  };
  
  export default function AuthReducer(state = initialState, action) {
    switch (action.type) {
      case RECEIVE_USER:
        return {
          ...state,
          signedIn: true,
          user: action.user,
        };
      case SIGN_OUT:
        return {
          ...state,
          signedIn: false
        }
      // case REQUEST_AUTHENTICATE_USER:
      //   return {
      //     ...state,
      //   }
      case REQUEST_LOCATION_DATA:
        return {
          ...state,
        }
      case RECEIVE_LOCATION_DATA:
        return {
          ...state,
          location: action.location 
        }
      default:
        return state;
    }
  }