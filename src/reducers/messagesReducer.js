import { GET_MESSAGES, MESSAGES_LOADING,NO_TYPE} from '../actions/types';
const initialState = {
    messages: [],
    loading: false
};
export default function(state = initialState, action) {
    switch (action.type) {
      case GET_MESSAGES:
        return {
          ...state,
          messages: action.payload,
          loading: false
        };
      case MESSAGES_LOADING:
        return {
          messages: [],
          loading: true
        };
      case NO_TYPE:
        return {
          ...state
        };
      default:
        return state;
    }
}