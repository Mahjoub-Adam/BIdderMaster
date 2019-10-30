import { GET_RATINGS, RATINGS_LOADING} from '../actions/types';
const initialState = {
    ratings: [],
    loading: false
};
export default function(state = initialState, action) {
    switch (action.type) {
      case GET_RATINGS:
        return {
          ...state,
          ratings: action.payload,
          loading: false
        };
      case RATINGS_LOADING:
        return {
          ratings: [],
          loading: true
        };
      default:
        return state;
    }
}