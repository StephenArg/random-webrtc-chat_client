// Constants
const ADD_MESSAGE = 'ADD_MESSAGE'


// Action Creators
export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    newMessage: message
  };
}

// Reducer

const initialState = {
    messages: []
  };
  
  export default function MessagesReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_MESSAGE:
        return {
          ...state,
          messages: [...state.messages, action.newMessage]
        };
      default:
        return state;
    }
  }