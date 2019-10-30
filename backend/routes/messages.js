const router=require('express').Router();
let Auction=require('../models/auction.model');
let Message=require('../models/message.model');
let User=require('../models/user.model');
const auth=require('../middleware/auth');
router.route('/add').post(auth,(req,res)=>{
    const auctionId=req.body.auctionId;
    const sender=req.id;
    const receiver=req.body.receiver;
    const message=req.body.message;  
    Auction.findById(auctionId).exec(function(err,auction){
        if(err) return res.status(400).json('Error:'+err)
        if(!auction) return res.status(400).json('Auction id was not found!');
        if(String(auction.ends)==="undefined")
            return res.status(400).json('Auction has not started!');
        if(auction.ends>new Date()) 
            return res.status(400).json('Auction has not finished yet!');
        if(auction.number_of_bids<=0) 
            return res.status(400).json('There were no bids in this auction!');
        if(sender!==auction.seller && sender!==auction.last_bid.bidder)
            return res.status(400).json('You are not involved in this auction!');
        if(receiver!==auction.seller && receiver!==auction.last_bid.bidder)
            return res.status(400).json('Receiver is not involved in this auction!');
        if(sender===receiver)
            return res.status(400).json('You cannot send a message to yourself!');
        User.findById(sender).exec(function(err,sender){
            if(err) return res.status(400).json('Error:'+err)
            if(!sender) return res.status(400).json('Auction id was not found!');
            User.findById(receiver).exec(function(err,receiver){
                if(err) return res.status(400).json('Error:'+err)
                if(!receiver) return res.status(400).json('Auction id was not found!');
                const newMessage=new Message({auctionId:auctionId,sender
                :sender.username,receiver:receiver.username,message:message,
                receiverID:req.body.receiver,senderID:req.id,seen:false});
                newMessage.save()
                    .then(message=>res.json(message))
                    .catch(err=>res.status(400).json('Error:'+err));
            });
        });
        
    });
});
router.route('/seen/:id').post(auth,(req,res)=>{
    Message.findById(req.params.id).exec(function(err,message){
        if(err) return res.status(400).json('Error:'+err)
        if(!message) return res.status(400).json('Auction id was not found!');
        if(message.receiverID!==req.id) return res.status(400).json('This message is not at your inbox!')
        message.seen=true;
        message.save()
            .then(()=>res.json(true))
            .catch(err=>res.status(400).json('Error:'+err));
    });
        
});
router.route('/search').post(auth,(req,res)=>{
    const id=req.id;
    const search=req.body.search;
    var query="";
    if(search==="inbox") query={receiverID:req.id}
    else query={senderID:req.id}
    Message.find(query)
        .sort({createdAt:-1})
        .then(messages=>res.json(messages))
        .catch(err=>res.status(400).json('Error:'+err));
});
module.exports=router;