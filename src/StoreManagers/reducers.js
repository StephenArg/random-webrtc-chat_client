import {combineReducers} from 'redux'
import AuthReducer from './AuthManager'
import MessagesReducer from './MessagesManager'

export const coreReducers = {
    Auth: AuthReducer,
    Messages: MessagesReducer
}

export default combineReducers(coreReducers)