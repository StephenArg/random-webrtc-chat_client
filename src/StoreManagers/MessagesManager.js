// Constants
const ADD_MESSAGE = 'ADD_MESSAGE'
const INCREASE_MESSAGE_ID_COUNTER = 'INCREASE_MESSAGE_ID_COUNTER'
const RESET_MESSAGES = 'RESET_MESSAGES'


// Action Creators
export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    newMessage: message
  };
}

export function resetMessages() {
  return {
    type: RESET_MESSAGES,
  };
}

export function increaseMessageIdCounter() {
  return {
    type: INCREASE_MESSAGE_ID_COUNTER,
  };
}

// Reducer

const initialState = {
    messages: [],
    messageIdCounter: 0,
  };
  
  export default function MessagesReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_MESSAGE:
        return {
          ...state,
          messages: [...state.messages, action.newMessage]
        };
      case RESET_MESSAGES:
          return {
            ...state,
            messages: []
          };
      case INCREASE_MESSAGE_ID_COUNTER:
          return {
            ...state,
            messageIdCounter: state.messageIdCounter + 1
          };
      default:
        return state;
    }
  }