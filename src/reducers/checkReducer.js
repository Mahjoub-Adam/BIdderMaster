import {
  GET_USERS,
  USERS_LOADING,
  USERS_EDITING
} from '../actions/types';

const initialState = {
  checks: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        checks: action.payload,
        loading: false
      };
      case USERS_LOADING:
      return {
        checks: [],
        loading: true
      };
      case USERS_EDITING:
      return{
        checks: state.checks.filter(check => check._id !== action.payload),
        loading: true
      }
    default:
      return state;
  }
}