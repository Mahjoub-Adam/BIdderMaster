import { GET_FORM_ERRORS, CLEAR_FORM_ERRORS } from '../actions/types';

const initialState = {
  msg: "",
  status: "",
  id: ""
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_FORM_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id
      };
    case CLEAR_FORM_ERRORS:
      return {
        msg: "",
        status: null,
        id: null
    };
    default:
      return state;
  }
}