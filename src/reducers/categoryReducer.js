import { 
    GET_CATEGORIES, 
    ADD_CATEGORY, 
    DELETE_CATEGORY, 
    CATEGORIES_LOADING } 
    from '../actions/types';
const initialState = {
    categories: [],
    loading: false
};
export default function(state = initialState, action) {
    switch (action.type) {
      case GET_CATEGORIES:
        return {
          ...state,
          categories: action.payload,
          loading: false
        };
      case DELETE_CATEGORY:
        return {
          ...state,
          categories: state.categories.filter(category => category.name !== action.payload && category.parents.includes(action.payload)===false)
        };
      case ADD_CATEGORY:
        return {
          ...state,
          categories: [action.payload, ...state.categories]
        };
      case CATEGORIES_LOADING:
        return {
          categories: [],
          loading: true
        };
      default:
        return state;
    }
  }