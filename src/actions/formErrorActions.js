import {GET_FORM_ERRORS,CLEAR_FORM_ERRORS} from './types';
export const returnFormErrors = (msg, status, id = null) => {
  return {
    type: GET_FORM_ERRORS,
    payload: { msg, status, id }
  };
};
export const clearFormErrors = () => (dispatch,getState) => {
  dispatch ({
    type: CLEAR_FORM_ERRORS
  });
};