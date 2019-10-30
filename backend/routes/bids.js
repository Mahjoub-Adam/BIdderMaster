const router=require('express').Router();
let Bid=require('../models/bids.model');
let Auction=require('../models/auction.model');
const bcrypt=require('bcryptjs');
const config=require('../config');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');

router.route('/add').post(auth,(req,res)=>{
    Auction.findById(req.body.auctionId).exec(function(err,auction){
        if(err) return res.status(400).json('Error:'+err)
        if(!auction) return res.status(400).json('Auction id was not found!')
        const auctionId=req.body.auctionId;
        const bidder=req.id;
        const offer=req.body.offer;
        const newBid=new Bid({auctionId,bidder,offer});
        if(String(auction.ends)==="undefined")
            return res.status(400).json('Auction has not started!');
        if(new Date()>auction.ends)
            return res.status(400).json('Auction has ended!');
        if(offer>auction.buy_price) 
            return res.status(400).json('Offer is greater than the buy price!');
        if(bidder===auction.seller)
            return res.status(400).json('You cannot bid on your own auction!');
        if(((String(auction.amount)!=="undefined" &&
            offer > auction.amount))|| (String(auction.amount)==="undefined" 
            && offer>=auction.first_bid)){
            newBid.save()
                .then(()=> {
                    auction.amount=offer;
                    auction.last_bid={
                        bidder:bidder
                    };
                    auction.number_of_bids+=1;
                    if(auction.amount===auction.buy_price)
                        auction.ends=new Date();
                    auction.save()
                        .then(()=> res.json(auction))
                        .catch(err=>res.status(400).json('Error:'+err));
                })
                .catch(err=>res.status(400).json('Error:'+err));
        }
        else if(String(auction.amount)==="undefined" 
            && offer<auction.first_bid)
            return res.status(400).json('Offer is lower than the first bid!');
        else return res.status(400).json('Offer is lower/equal than the current bid!');
    });
});

router.route('/searchMyBids').post(auth,(req,res)=>{
    var query1=null;
    var query=null;
    var query2=null;
    const token=req.header('x-auth-token');
    if(token) {
        try{
        const decoded=jwt.verify(token,config.jwtSecret);
        req.id=decoded.id;
        }
        catch(e) {
            return res.status(400).json('Token not valid!');
        }
        query1={seller :{$not : {$eq : req.id}}};
    }
    else query={}
    query2={description:new RegExp(req.body.description,"i")};
    query=Object.assign(query2,query1);
    query2={name:new RegExp(req.body.name,"i")};
    query1=query;
    query=Object.assign(query2,query1);
    query2={categories:{$in :req.body.categories}};
    query1=query;
    query=Object.assign(query2,query1);
    query2={ coords: { $geoWithin: { $centerSphere: [ [ req.body.location.lon, req.body.location.lat ] ,
    req.body.Km/0.621371192 / 3963.2 ] } }};
    query1=query;
    query=Object.assign(query2,query1);
    const date=new Date();
    if(req.body.cur_old==="Old")
        query1={$and : [{ends :{$exists : true}},{ends : {$lt : date }}]};
    else query1={$and : [{ends :{$exists : true}},{ends : {$gt : date }}]}
    query=Object.assign(query,query1);
    Auction.find(query)
        .then(auctions=>{
            auctions=auctions.filter((auction)=>
            ((String(auction.amount)==="undefined" &&
            auction.first_bid>=Number(req.body.min) && 
            auction.first_bid<=Number(req.body.max))||
            (auction.amount>=Number(req.body.min) && 
            auction.amount<=Number(req.body.max) )));
            var ids=auctions.map((auction)=>{return auction._id});
            query={auctionId :{$in :ids},bidder : req.id};
            Bid.find(query)
                .then(bids=>{
                    ids=bids.map((bid)=>{return bid.auctionId});
                    auctions=auctions.filter((auction)=>
                    ids.includes(String(auction._id)));    
                    res.json(auctions);
                })
                .catch(err=>res.status(400).json('Error:'+err));
        })
        .catch(err=>res.status(400).json('Error:'+err));
});


module.exports=router;