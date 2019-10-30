import axios from 'axios';
import { MESSAGES_LOADING,GET_MESSAGES,GET_AUCTIONS,NO_TYPE,SEEN}  
from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import {getRatings} from './auctionsActions'
export const setMessagesLoading = () => {
    return {
      type: MESSAGES_LOADING
    };
};
export const getAuctions=({ids})=>(dispatch, getState) => {
  const body = JSON.stringify({ids});
  axios
    .post(`https://localhost:5000/auctions/searchIDs`, body, tokenConfig(getState))
    .then(res =>{
        dispatch({
          type: GET_AUCTIONS,
          payload: res.data
        });
        const auctions=res.data.map((auction)=>{return {
          auction_id:auction._id,seller:auction.seller,
          bidder:String(auction.last_bid)!=="undefined"
          ?auction.last_bid.bidder:"undefined"};});
        dispatch(getRatings({auctions:auctions}));      
      })
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const searchMessages = ({search}) => (dispatch,getState) => {
    const body=JSON.stringify({search});
    dispatch(setMessagesLoading());
    axios
      .post('https://localhost:5000/messages/search',body,tokenConfig(getState))
      .then(res =>{
        dispatch({
          type: GET_MESSAGES,
          payload: res.data
        });
        const auctions=res.data.map(({auctionId})=>{return auctionId;});
        dispatch(getAuctions({ids:auctions}));
      })
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const addMessage = ({auctionId,receiver,message}) => (dispatch,getState) => {
    const body=JSON.stringify({auctionId,receiver,message});
    axios
      .post('https://localhost:5000/messages/add',body,tokenConfig(getState))
      .then(res =>
        dispatch({
          type: NO_TYPE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const newMessages = () => (dispatch,getState) => {
    const body=JSON.stringify({search:"inbox"});
    axios
      .post('https://localhost:5000/messages/search',body,tokenConfig(getState))
      .then(res =>{
        res=res.data.map((msg)=>{return msg.seen;});
        const flag=res.includes(false);
        dispatch({
          type:SEEN,
          payload:flag
        });
      })
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const setSeen = ({id}) => (dispatch,getState) => {
    const body=JSON.stringify({});
    axios
      .post(`https://localhost:5000/messages/seen/${id}`,body,tokenConfig(getState))
      .then(res =>{
       dispatch(newMessages());
      })
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
