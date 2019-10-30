import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import formErrorReducer from './formErrorReducer';
import authReducer from './authReducer';
import auctionsReducer from './auctionsReducer';
import checkReducer from './checkReducer'
import categoriesReducer from './categoryReducer'
import ratingsReducer from './ratingsReducer'
import messagesReducer from './messagesReducer'
export default combineReducers({
  error: errorReducer,
  formError: formErrorReducer,
  auth: authReducer,
  auctions: auctionsReducer,
  check: checkReducer,
  categories : categoriesReducer,
  ratings : ratingsReducer,
  messages : messagesReducer
});