import axios from 'axios';
import { GET_CATEGORIES, ADD_CATEGORY, DELETE_CATEGORY, CATEGORIES_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
export const setCategoriesLoading = () => {
    return {
      type: CATEGORIES_LOADING
    };
};
export const addCategory = ({name,parents}) => (dispatch, getState) => {
   const body = JSON.stringify({name,parents});
    axios
      .post(`https://localhost:5000/categories/add`, body, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: ADD_CATEGORY,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const getCategories= () => (dispatch,getState) => {
    dispatch(setCategoriesLoading());
    axios
      .get('https://localhost:5000/categories',tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CATEGORIES,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const deleteCategory = (id,name) => (dispatch, getState) => {
    const body=JSON.stringify({name});
    axios
      .post(`https://localhost:5000/categories/delete/${id}`,body, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: DELETE_CATEGORY,
          payload: name
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};