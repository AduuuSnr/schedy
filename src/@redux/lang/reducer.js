import {de, en} from 'languages';
import {SET_LANGUAGE} from './actionTypes';

const initialState = en;

const reducer = (state = initialState, action) => {
  const type = action.type;

  if (type == SET_LANGUAGE) {
    if (action.payload == 'en') return en;

    return de;
  }

  return state;
};

export default reducer;
