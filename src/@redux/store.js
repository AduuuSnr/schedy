import {createStore, combineReducers} from 'redux';
import app from '@redux/app/reducer';
import lang from '@redux/lang/reducer';
const rootReducer = combineReducers({app, lang});
const store = createStore(rootReducer);

export default store;
