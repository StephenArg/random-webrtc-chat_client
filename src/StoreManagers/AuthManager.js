// eslint-disable-next-line
import {all, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'

// Constants
const SIGN_IN = 'SIGN_IN';
const SIGN_OUT = 'SIGN_OUT'
const REQUEST_LOCATION_DATA = 'REQUEST_LOCATION_DATA'
const RECEIVE_LOCATION_DATA = 'RECEIVE_LOCATION_DATA'
const SET_BROWSER_HISTORY = 'SET_BROWSER_HISTORY'


// Action Creators
export function signIn() {
  return {
    type: SIGN_IN,
  };
}

export function signOut() {
    return {
        type: SIGN_OUT,
    };
}

export function requestLocationData() {
    return {
        type: REQUEST_LOCATION_DATA,
    }
}

export function receiveLocationData(location) {
    return {
        type: RECEIVE_LOCATION_DATA,
        location: location
    }
}

export function setBrowserHistory(history) {
    return {
        type: SET_BROWSER_HISTORY,
        history: history
    }
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

export function* authRootSaga() {
    yield takeEvery(REQUEST_LOCATION_DATA, locationData)
}

// Reducer

const initialState = {
    email: "",
    signedIn: false,
    location: "",
    history: null
  };
  
  export default function AuthReducer(state = initialState, action) {
    switch (action.type) {
      case SIGN_IN:
        return {
          ...state,
          signedIn: true
        };
      case SIGN_OUT:
        return {
          ...state,
          signedIn: false
        }
      case REQUEST_LOCATION_DATA:
        return {
          ...state,
        }
      case RECEIVE_LOCATION_DATA:
        return {
          ...state,
          location: action.location 
        }
      case SET_BROWSER_HISTORY:
        return {
            ...state,
            history: action.history
        }
      default:
        return state;
    }
  }