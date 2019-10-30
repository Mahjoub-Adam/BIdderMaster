import axios from 'axios';
import { GET_AUCTIONS, ADD_AUCTION, DELETE_AUCTION, AUCTIONS_LOADING,
RATINGS_LOADING,GET_RATINGS}  
from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnFormErrors } from './formErrorActions';
export const setAuctionsLoading = () => {
    return {
      type: AUCTIONS_LOADING
    };
};
export const setRatingsLoading = () => {
    return {
      type: RATINGS_LOADING
    };
};
export const rate = ({auction_id,id2,rating}) => (dispatch, getState) => {
  const body = JSON.stringify({ auction_id,id2,rating});
  console.log(body);
  axios
    .post(`https://localhost:5000/auctions/rate`, body, tokenConfig(getState))
    .then(res =>{
        dispatch({
            type: DELETE_AUCTION,
            payload: auction_id
          });
          dispatch({
            type: ADD_AUCTION,
            payload: res.data
          });
        }
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const getRatings = ({auctions}) => (dispatch,getState) => {
    auctions=String(auctions)==="undefined"?[]:auctions;
    const body=JSON.stringify({auctions});
    dispatch(setRatingsLoading());
    axios
      .post('https://localhost:5000/auctions/getRatings',body,tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_RATINGS,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const searchDownloads = ({name,categories,min,max,description,location,displayType,Km}) => (dispatch,getState) => {
    const body=JSON.stringify({name,categories,min,max,description,location,displayType,Km});
    dispatch(setAuctionsLoading());
    axios
      .post('https://localhost:5000/auctions/searchDownloads',body,tokenConfig(getState))
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
export const makeAbid = ({auctionId,offer}) => (dispatch, getState) => {
  const body = JSON.stringify({ auctionId,offer});
  axios
    .post(`https://localhost:5000/bids/add`, body, tokenConfig(getState))
    .then(res =>{
        dispatch({
            type: DELETE_AUCTION,
            payload: auctionId
          });
          dispatch({
            type: ADD_AUCTION,
            payload: res.data
          });
        }
      )
      .catch(err =>
        dispatch(returnFormErrors(err.response.data, err.response.status))
      );
};
export const searchMyRatings = ({name,categories,min,max,description,location,displayType,Km}) => (dispatch,getState) => {
    const body=JSON.stringify({name,categories,min,max,description,location,displayType,Km});
    dispatch(setAuctionsLoading());
    axios
      .post('https://localhost:5000/auctions/searchMyRatings',body,tokenConfig(getState))
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
export const searchMyBids = ({name,categories,min,max,description,location,displayType,Km,cur_old}) => (dispatch,getState) => {
    const body=JSON.stringify({name,categories,min,max,description,location,displayType,Km,cur_old});
    dispatch(setAuctionsLoading());
    axios
      .post('https://localhost:5000/bids/searchMyBids',body,tokenConfig(getState))
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
export const searchMyAuctions = ({name,categories,min,max,description,location,displayType,Km,cur_old}) => (dispatch,getState) => {
    const body=JSON.stringify({name,categories,min,max,description,location,displayType,Km,cur_old});
    dispatch(setAuctionsLoading());
    axios
      .post('https://localhost:5000/auctions/searchMyAuctions',body,tokenConfig(getState))
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
export const searchMessageAuctions = () => (dispatch,getState) => {
    dispatch(setAuctionsLoading());
    axios
      .get('https://localhost:5000/auctions/searchMessageAuctions',tokenConfig(getState))
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
export const searchAllAuctions = ({name,categories,min,max,description,location,displayType,Km}) => (dispatch,getState) => {
    const body=JSON.stringify({name,categories,min,max,description,location,displayType,Km});
    dispatch(setAuctionsLoading());
    axios
      .post('https://localhost:5000/auctions/searchAllAuctions',body,tokenConfig(getState))
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
export const addAuction = ({ id,name, categories, buy_price, first_bid, country, location, description,imgs,del}) => (dispatch, getState) => {
   const form_data=new FormData();
   imgs.forEach((img)=>{
      form_data.append('imgs',img);
   });
   form_data.append('name',name);
   categories.forEach((category)=>form_data.append('categories',category));
   form_data.append('buy_price',buy_price);
   form_data.append('first_bid',first_bid);
   form_data.append('country',country);
   form_data.append('address',location.address);
   form_data.append('lon',location.coords[0]);
   form_data.append('lat',location.coords[1]);
   form_data.append('description',description);
    const config=tokenConfig(getState);
    const headers={
      headers:{
        'x-auth-token': config.headers['x-auth-token']
      }
    }
    axios
      .post(`https://localhost:5000/auctions/add`,form_data,headers)
      .then(res =>res =>
        {
          dispatch({
            type: ADD_AUCTION,
            payload: res.data
          });
        }
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };
  export const startAuction = ({id,timer}) => (dispatch,getState) => {
    const body = JSON.stringify({timer});
    axios
      .post(`https://localhost:5000/auctions/start/${id}`,body,tokenConfig(getState))
      .then(res =>
        {
          dispatch({
            type: DELETE_AUCTION,
            payload: id
          });
          dispatch({
            type: ADD_AUCTION,
            payload: res.data
          });
        }
      )
      .catch(err =>
        dispatch(returnFormErrors(err.response.data, err.response.status))
      );
};
  export const updateAuction = ({ id,name, categories, buy_price, first_bid, country, location, description,imgs,del}) => (dispatch, getState) => {
   const form_data=new FormData();
   imgs.forEach((img)=>{
     if(String(img.name)==="undefined") form_data.append('imgs2',img.src);
     else form_data.append('imgs',img);
   });
   del.forEach((img)=>{
      form_data.append('del',img.src);
   });
   form_data.append('name',name);
   categories.forEach((category)=>form_data.append('categories',category));
   form_data.append('buy_price',buy_price);
   form_data.append('first_bid',first_bid);
   form_data.append('country',country);
   form_data.append('address',location.address);
   form_data.append('lon',location.coords[0]);
   form_data.append('lat',location.coords[1]);
   form_data.append('description',description);
    const config=tokenConfig(getState);
    const headers={
      headers:{
        'x-auth-token': config.headers['x-auth-token']
      }
    }
    axios
      .post(`https://localhost:5000/auctions/update/${id}`, form_data, headers)
      .then(res =>
        {
          dispatch({
            type: DELETE_AUCTION,
            payload: id
          });
          dispatch({
            type: ADD_AUCTION,
            payload: res.data
          });

        }
      )
      .catch(err =>
        dispatch(returnFormErrors(err.response.data, err.response.status))
      );
  };
export const deleteAuction = id => (dispatch, getState) => {
    axios
      .delete(`https://localhost:5000/auctions/delete/${id}`, tokenConfig(getState))
      .then( ()=>
        dispatch({
          type: DELETE_AUCTION,
          payload: id
        })
      )
      .catch(err =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
};
export const downloadAuction = ({id}) => (dispatch, getState) => {
  const body = JSON.stringify({id});
    axios
      .post(`https://localhost:5000/auctions/create`,body ,tokenConfig(getState))
      .then( ()=>{return;}
      )
      .catch(err =>
        dispatch(returnFormErrors(err.response.data, err.response.status))
      );
};
