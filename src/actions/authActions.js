import axios from 'axios';
import { returnErrors } from './errorActions';
import { returnFormErrors } from './formErrorActions';
import { newMessages } from './messagesActions';
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
  GUEST_LOADED
} from './types';
export const tokenConfig = getState => {
  const token = getState().auth.token;
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
 
};
export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  axios.get('https://localhost:5000/users/auth', tokenConfig(getState))
    .then(res =>{
       if( res.data==="Guest!")
        dispatch({
          type: GUEST_LOADED,
          payload: res.data
        });
      else if(res.data.username==="admin")
        dispatch({
          type: ADMIN_LOADED,
          payload: res.data
        });
      else{ 
        dispatch({
        type: USER_LOADED,
        payload: res.data
        });
        dispatch(newMessages());
      }
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const register = ({ username, password,verifyPassword, name, surname, email, PhoneNumber, address, AFM,country }) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }; 
  const body = JSON.stringify({ username, password,verifyPassword,name, surname, email, PhoneNumber, address, AFM,country });
  axios
    .post('https://localhost:5000/users/signup', body, config)
    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};
export const login = ({ username, password }) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ username, password });
  axios
    .post('https://localhost:5000/users/login', body, config)
    .then(res =>{
      username==="admin"?
        dispatch({
          type: ADMIN_SUCCESS,
          payload: res.data
        })
        :
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        })
    }
    )
    .catch(err => {
      dispatch(
        returnFormErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};