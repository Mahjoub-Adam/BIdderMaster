import axios from 'axios';
import { GET_USERS, USERS_LOADING,USERS_EDITING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const setUsersLoading = () => {
  return {
    type: USERS_LOADING
  };
};

export const getUsers = () => (dispatch,getState) => {
  dispatch(setUsersLoading());
  axios
    .get('https://localhost:5000/users/admin', tokenConfig(getState))
    .then(res =>
        dispatch({
          type: GET_USERS,
          payload: res.data
        })
      )
    
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const editUsers = (id) => (dispatch,getState) => {
  console.log(tokenConfig(getState));
  axios
    .get(`https://localhost:5000/users/update/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
          type: USERS_EDITING,
          payload: id
        })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    ); 
};

export const delUsers = (id) => (dispatch,getState) => {
  axios
    .delete('https://localhost:5000/users/' + id,tokenConfig(getState))
    .then(res =>
      dispatch({
          type: USERS_EDITING,
          payload: id
        })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    ); 
};

