/* eslint-disable no-unreachable */
import {SET_MY_STREAM, SET_PEER_SERVER, SET_RTC_SOCKET} from './types';

const initialState = {
  rtcSocket: null,
  myStream: null,
  peerServer: null,
};

const reducer = (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case SET_MY_STREAM:
      return {...state, user: action.payload};
      break;
    case SET_RTC_SOCKET:
      return {...state, rtcSocket: action.payload};
      break;
    case SET_PEER_SERVER:
      return {...state, peerServer: action.payload};
      break;
    default:
      break;
  }

  return state;
};

export default reducer;
