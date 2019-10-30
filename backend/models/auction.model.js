const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const AuctionSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    categories:[
        {
        type:String,
        required:true,
        }
    ],
    buy_price:{
        type:Number,
        required:true,
    },
    first_bid:{
        type:Number,
        required:true
    },
    number_of_bids:{
        type:Number,
        required:true
    },
    last_bid:{
       type:{
                bidder:{
                    type:String,
                    required:true
                }
            },
            timestamps:true,
            
    },
    address:{
        type:String,
        required:true
    },
    coords:{
        type:[Number],
        index:'2d'
    },
    images:[
        {
        type:String,
        required:true,
        }
    ],
    country:{
        type:String,
        required:true
    },
    started:{
        type:Date
    },
    ends:{
        type:Date
    },
    amount:{
        type:Number
    },
    seller:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    sellerRating:{
        type:Boolean,
        required:true
    },
    bidderRating:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true,
    });
const Auction=mongoose.model('Auction',AuctionSchema);
module.exports=Auction;