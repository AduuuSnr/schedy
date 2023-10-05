/* eslint-disable no-unreachable */
import {
  SET_SOCKET,
  SET_USER,
  SET_RECENTTIME,
  SET_BUSINESSES,
  SET_TWILIO_TOKEN,
  SET_ADVERTISEMENT,
} from './types';

const initialState = {
  user: null,
  socket: null,
  businesses: null,
  recentTime: null,
  twilioToken: null,
  advertisement: '',
};

const reducer = (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case SET_USER:
      return {...state, user: action.payload};
      break;
    case SET_SOCKET:
      return {...state, socket: action.payload};
      break;
    case SET_BUSINESSES:
      return {...state, businesses: action.payload};
      break;
    case SET_RECENTTIME:
      return {...state, recentTime: action.payload};
      break;
    case SET_TWILIO_TOKEN:
      return {...state, twilioToken: action.payload};
      break;
    case SET_ADVERTISEMENT:
      return {...state, advertisement: action.payload};
      break;
    default:
      break;
  }

  return state;
};

export default reducer;
