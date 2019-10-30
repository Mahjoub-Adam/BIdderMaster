const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const messageSchema= new Schema({
    auctionId:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    senderID:{
        type:String,
        required:true
    },
    receiverID:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    seen:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true,
    });
const Messages=mongoose.model('Messages',messageSchema);
module.exports=Messages;