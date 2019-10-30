import {
    GET_AUCTIONS,
    ADD_AUCTION,
    DELETE_AUCTION,
    AUCTIONS_LOADING
  } from '../actions/types';
  const initialState = {
    auctions: [],
    loading: false
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_AUCTIONS:
        return {
          ...state,
          auctions: action.payload,
          loading: false
        };
      case DELETE_AUCTION:
        return {
          ...state,
          auctions: state.auctions.filter(auction => auction._id !== action.payload)
        };
      case ADD_AUCTION:
        return {
          ...state,
          auctions: [action.payload, ...state.auctions]
        };
      case AUCTIONS_LOADING:
        return {
          auctions:[],
          loading: true
        };
      default:
        return state;
    }
  }