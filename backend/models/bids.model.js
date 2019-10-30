const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bidSchema= new Schema({
    auctionId:{
        type:String,
        required:true
    },
    bidder:{
        type:String,
        required:true
    },
    offer:{
        type:Number,
        required:true
    }
},{
    timestamps:true,
    });
const Bid=mongoose.model('Bid',bidSchema);
module.exports=Bid;


 