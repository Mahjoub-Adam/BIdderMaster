import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  ADMIN_SUCCESS,
  ADMIN_LOADED,
  GUEST_LOADED,
  SEEN
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: "false",
  isAdmin:"false",
  isLoading: false,
  isListed:true,
  user: "",
  rating: "undefined",
  newMessages:"undefined"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        token: localStorage.getItem('token'),
        isAuthenticated: "undefined",
        isAdmin:"undefined",
        isLoading: false,
        isListed:true,
        user: "",
        rating: "undefined",
        newMessages:"undefined"
      };
    case ADMIN_LOADED:
      return {
        ...state,
        isAuthenticated: "true",
        isAdmin:"true",
        isLoading: false,
        isListed:false,
        user: action.payload.username,
        rating:"undefined",
        newMessages:"undefined"
    };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: "true",
        isAdmin:"false",
        isLoading: false,
        isListed:action.payload.listed,
        user: action.payload.username,
        rating: action.payload.rating,
        newMessages:"undefined"
    };
    case REGISTER_SUCCESS:  
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token:action.payload.token,
        user:action.payload.username,
        rating: action.payload.rating,
        isAuthenticated: "true",
        isAdmin:"false",
        isListed:action.payload.listed,
        isLoading: false,
        newMessages:"undefined"
    };
    case ADMIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token:action.payload.token,
        user:action.payload.username,
        isAdmin:"true",
        isAuthenticated: "true",
        isListed:false,
        isLoading: false,
        newMessages:"undefined",
        rating:"undefined"
    };
    case SEEN:
      return{
        ...state,
        newMessages:String(action.payload),
        rating:"undefined"
    };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
    case GUEST_LOADED:
      localStorage.clear();
      return {
        ...state,
        token: null,
        isAdmin:"false",
        user: "",
        rating: "undefined",
        isListed:false,
        isAuthenticated: "false",
        isLoading: false,
        newMessages:"undefined"
      };
    default:
      return state;
  }
}