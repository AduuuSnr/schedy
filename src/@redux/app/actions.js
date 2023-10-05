import {
  SET_BUSINESSES,
  SET_RECENTTIME,
  SET_SOCKET,
  SET_USER,
  SET_TWILIO_TOKEN,
  SET_ADVERTISEMENT,
} from './types';

export const setUser = user => ({type: SET_USER, payload: user});
export const setSocket = socket => ({type: SET_SOCKET, payload: socket});

export const setRecentTime = recentTime => ({
  type: SET_RECENTTIME,
  payload: recentTime,
});
export const setBusinesses = businesses => ({
  type: SET_BUSINESSES,
  payload: businesses,
});
export const setTwilioToken = token => ({
  type: SET_TWILIO_TOKEN,
  payload: token,
});
export const setAdvertisement = adUrl => ({
  type: SET_ADVERTISEMENT,
  payload: adUrl,
});
