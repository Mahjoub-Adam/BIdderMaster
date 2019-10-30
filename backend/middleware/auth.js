const config=require('../config');
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
function auth(req,res,next){
    const token=req.header('x-auth-token');
    if(!token) return res.status(400).json('Authorization denied!');
    try{
        const decoded=jwt.verify(token,config.jwtSecret);
        req.id=decoded.id;
        req.auction_id=req.params.id?req.params.id:
        new mongoose.Types.ObjectId();
        next();
    }
    catch(e) {
        return res.status(400).json('Token not valid!');
    }
    
}
module.exports=auth;