const router=require('express').Router();
let Auction=require('../models/auction.model');
let User=require('../models/user.model');
const auth=require('../middleware/auth');
const multer=require('multer');
const fs = require('fs');
const config=require('../config');
const jwt=require('jsonwebtoken');
let parser = require('xml2json');
let Bid=require('../models/bids.model');
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename : function(req,file,cb){
        cb(null,req.auction_id+"_"+Date.now()+"_"+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="image/x-png" || file.mimetype==="image/png" ||
        file.mimetype==="image/jpg" || file.mimetype==="image/jpeg")
        cb(null,true);
    else cb(new Error("Only image files are allowed!"),false);
}
const upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024,
        files: 5
    },
    fileFilter: fileFilter
});
router.route('/add').post(auth,upload.array('imgs'),(req,res)=>{
    const name=req.body.name;
    const categories=req.body.categories;
    const buy_price=Number(req.body.buy_price);
    const number_of_bids=0;
    const location={
        address:req.body.address,
        coords:[req.body.lon,req.body.lat]
    }
    const country=req.body.country;
    const first_bid=Number(req.body.first_bid);
    const seller=req.id;
    const id=req.auction_id;
    const imgs=req.files.map((file)=>{return "https://localhost:5000/uploads/"+
    file.filename;});
    const description=req.body.description;
    newAuction=new Auction({_id:id,name:name,categories:categories,buy_price:buy_price,
    number_of_bids:number_of_bids,address:location.address,coords:location.coords,
    country:country,first_bid:first_bid,seller:seller,description:description,images:imgs,
    bidderRating:false,sellerRating:false});
    newAuction.save()
        .then(()=>res.json(newAuction))
        .catch(err=>res.status(400).json('Error:'+err));
});
router.route('/update/:id').post(auth,upload.array('imgs'),(req,res)=>{
    const name=req.body.name;
    const categories=req.body.categories;
    const buy_price=Number(req.body.buy_price);
    const number_of_bids=0;
    const location={
        address:req.body.address,
        coords:[req.body.lon,req.body.lat]
    }
    const country=req.body.country;
    const first_bid=Number(req.body.first_bid);
    const seller=req.id;
    const description=req.body.description;
    var imgs=req.files.map((file)=>{return "https://localhost:5000/uploads/"+
    file.filename;});
    var imgs2=String(req.body.imgs2)==="undefined"?[]:req.body.imgs2;
    imgs2=typeof(imgs2)==="string"? imgs2.split():imgs2;
    imgs=imgs.concat(imgs2.map((img)=>{return img;}))
    var del=String(req.body.del)==="undefined"?[]:req.body.del;
    del=typeof(del)==="string"? del.split():del;
    Auction.findById(req.params.id).exec(function(err,auction){
        if(err) return res.status(400).json('Error:'+err)
        if(!auction) return res.status(400).json('Auction id was not found!');
        if(String(auction.ends)!=="undefined") return res.status(400).json("Auction cannot be updated,since it has already started!");
        auction.name=name;
        auction.categories=categories;
        auction.buy_price=buy_price;
        auction.number_of_bids=number_of_bids;
        auction.address=location.address
        auction.coords=location.coords
        auction.country=country;
        auction.first_bid=first_bid;
        auction.seller=seller;
        auction.description=description;
        auction.images=imgs;
        auction.save()
            .then(()=> {
                del.forEach((img)=>{
                    const index=img.search("uploads");
                    var imgDel=img.substring(index);
                    fs.unlink(imgDel, (err) => {
                        if(err) return res.status(400).json('Error:'+err)
                    });
                });
                res.json(auction);
            })
            .catch(err=>res.status(400).json('Error:'+err));
    });
});
router.route('/start/:id').post(auth,(req,res)=>{
    const timer=Number(req.body.timer)*1000*60*60;
    Auction.findById(req.params.id).exec(function(err,auction){
        if(err) return res.status(400).json('Error:'+err)
        if(!auction) return res.status(400).json('Auction id was not found!');
        if(String(auction.ends)!=="undefined") return res.status(400).json("Auction has already started!");
        const time=new Date();
        auction.started=time;
        ends=new Date(time.getTime()+timer);
        auction.ends=ends;
        auction.save()
            .then(auction=> res.json(auction))
            .catch(err=>res.status(400).json('Error:'+err));
    });
});
router.route('/searchIDs').post(auth,(req,res)=>{
    const ids=req.body.ids;
    const query={_id:{$in :ids}};
    Auction.find(query)
        .then(auctions=> res.json(auctions))
        .catch(err=>res.status(400).json('Error:'+err));
});
router.route('/searchMessageAuctions').get(auth,(req,res)=>{
    const id=req.id;
    const date=new Date();
    const query1={$and : [{ends :{$exists : true}},{ends : {$lt : date }}]}
    const query2={number_of_bids :{$gt : 0}}
    const query=Object.assign(query1,query2);
    Auction.find(query)
        .then(auctions=> res.json(auctions.filter((auction)=>
            id===auction.seller || id===auction.last_bid.bidder)))
        .catch(err=>res.status(400).json('Error:'+err));
});
router.route('/searchMyAuctions').post(auth,(req,res)=>{  
    var query1=null;
    var query=null;
    query1={seller:req.id}; 
    var query2=null;
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
    else query1={$or : [{ends :{$exists : false}},{ends : {$gt : date }}]}
    query=Object.assign(query,query1);
    Auction.find(query)
        .then(auctions=>res.json(auctions.filter((auction)=>
            ((String(auction.amount)==="undefined" &&
            auction.first_bid>=Number(req.body.min) && 
            auction.first_bid<=Number(req.body.max))||
            (auction.amount>=Number(req.body.min) && 
            auction.amount<=Number(req.body.max) )))))
        .catch(err=>res.status(400).json('Error:'+err));
});
router.route('/searchAllAuctions').post((req,res)=>{
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
    query1={$or : [{ends :{$exists : false}},{ends : {$gt : date }}]};
    query=Object.assign(query,query1);
    Auction.find(query)
        .then(auctions=>res.json(auctions.filter((auction)=>
            ((String(auction.amount)==="undefined" &&
            auction.first_bid>=Number(req.body.min) && 
            auction.first_bid<=Number(req.body.max))||
            (auction.amount>=Number(req.body.min) && 
            auction.amount<=Number(req.body.max) )))))
        .catch(err=>res.status(400).json('Error:'+err));
});
router.route('/delete/:id').delete(auth,(req, res)=>{
    Auction.findById(req.params.id).exec(function(err,auction){
        if(err) return res.status(400).json('Error:'+err)
        if(!auction) return res.status(400).json('Auction id was not found!');
        Auction.findOne({_id:req.params.id,amount :{$exists : false}}).exec(function(err,auction){
            if(err) return res.status(400).json('Error:'+err)
            const imgs=auction.images;
            if(!auction) return res.status(400).json("Auction cannot be deleted,a bid was already made!")
            auction.remove()
                .then(auction=>{
                    imgs.forEach((img)=>{
                        const index=img.search("uploads");
                        var del=img.substring(index);
                        fs.unlink(del, (err) => {
                            if(err) return res.status(400).json('Error:'+err)
                        });
                    });
                    res.json("Auction deleted!");
                })
                .catch(err=>res.status(400).json('Error:'+err));
        });
    });
});
router.route('/searchMyRatings').post(auth,(req,res)=>{  
    var query1=null;
    var query=null;
    var query2=null;
    query={description:new RegExp(req.body.description,"i")};
    query2={name:new RegExp(req.body.name,"i")};
    query1=query;
    const id=req.id;
    query=Object.assign(query2,query1);
    query2={categories:{$in :req.body.categories}};
    query1=query;
    query=Object.assign(query2,query1);
    query2={ coords: { $geoWithin: { $centerSphere: [ [ req.body.location.lon, req.body.location.lat ] ,
    req.body.Km/0.621371192 / 3963.2 ] } }};
    query1=query;
    query=Object.assign(query2,query1);
    const date=new Date();
    query1={$or : [{ends :{$exists : false}},{ends : {$lt : date }}]};
    query=Object.assign(query,query1);
    Auction.find(query)
        .then(auctions=>res.json(auctions.filter((auction)=>
            (auction.amount>=Number(req.body.min) && 
            auction.amount<=Number(req.body.max) && 
            auction.number_of_bids>0 &&
            ((auction.seller===id && auction.bidderRating===false)
            || (auction.last_bid.bidder===id && auction.sellerRating===false))
        ))))
        .catch(err=>res.status(400).json('Error:'+err));
});
function myFunc(x,res,_callback){
    var ret=[];
    const auction_id=x.auction_id;
    const seller=x.seller;
    const bidder=x.bidder;     
    Auction.findById(auction_id).exec(function(err,auction){
            if(err) return res.status(400).json('Error:'+err)
            if(!auction) return res.status(400).json('Auction id was not found!');
            if(auction.seller!==seller) 
                return res.status(400).json('Seller id is not right!');
            if((bidder!=="undefined" && String(auction.last_bid)!=="undefined" 
                && auction.last_bid.bidder!==bidder)||
                (bidder==="undefined" && String(auction.last_bid)!=="undefined")||
                (bidder!=="undefined" && String(auction.last_bid)==="undefined"))
                return res.status(400).json('Bidder id is not right!');
            User.findById(seller)
            .select('username rating -_id')
            .then(seller => {
                if(bidder!=="undefined"){
                    User.findById(bidder)
                    .select('username rating -_id')
                    .then(bidder => { ret=[{auction_id,seller,bidder}];
                        _callback(ret);
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
                }
                else {
                    const bidder={
                        username:"No Bidder",
                        rating:"No Bidder"
                    }
                    ret=[{auction_id,seller,bidder}];
                    _callback(ret);            
                }
                
            })
            .catch(err => res.status(400).json('Error: ' + err));      
    });
}
function myFunc2(auctions,res,_callback){
    var x=0;
    var result=[];
    for(auction of auctions) {
        try{
            myFunc(auction,res,function(ret){
                x++;
                result=result.concat(ret);
                if(x===auctions.length) _callback(result);
            }); 
        }
        catch(err) {
            return res.status(400).json('Error: ' + err)
        }            
    }   
}
router.post('/getRatings', (req, res) => {
    const token=req.header('x-auth-token');
    if(token) {
        try{
            const decoded=jwt.verify(token,config.jwtSecret);
            req.id=decoded.id;
        }
        catch(e) {
            return res.status(400).json('Token not valid!');
        }
    }
    var ret=[];
    const auctions=req.body.auctions;
    if(auctions.length===0) return res.json([]);
    try{
        myFunc2(auctions,res,function(ret){
            return res.json(ret);
        });
    }
    catch(err) {
        return res.status(400).json('Error: ' + err)
    }
    
});
router.post('/rate',auth,(req, res) => {
    const id=req.id;
    const id2=req.body.id2;
    const auction_id=req.body.auction_id;
    if(req.body.rating>5 || req.body.rating<0) 
        return res.status(400).json('Rating must be between 1-5 star(s)');
    if(id===id2) return res.status(400).json('You cannot rate yourself!');
    Auction.findById(auction_id).exec(function(err,auction){
        if(err) return res.status(400).json('Error:'+err)
        if(!auction) return res.status(400).json('Auction id was not found!');
        if(String(auction.ends)==="undefined")
            return res.status(400).json('Auction has not started!');
        if(auction.ends>new Date()) 
            return res.status(400).json('Auction has not finished yet!');
        if(String(auction.last_bid)==="undefined")
            return res.status(400).json('Auction has no bidders!');
        console.log(id2);
        console.log(auction.seller)
        console.log(auction.last_bid.bidder)
        if(auction.seller!==id && auction.last_bid.bidder!==id)
            return res.status(400).json('You are not involved in this auction!');
        if(auction.seller!==id2 && auction.last_bid.bidder!==id2)
            return res.status(400).json('The user,you are trying to rate,is not involved in this auction!');
        if((auction.seller===id2 && auction.sellerRating===true)
            || (auction.last_bid.bidder===id2 && auction.bidderRating===true))
            return res.status(400).json('You already rated this user for this auction!');
        User.findById(id2)
            .then(user => {
                if(user.rating==="Not Rated"){
                    user.rating=req.body.rating;
                    user.number_of_ratings=1;
                }
                else{
                    user.number_of_ratings++;
                    user.rating=String(
                        (Number(user.rating)*(user.number_of_ratings-1)+
                        Number(req.body.rating))/user.number_of_ratings);           
                }
                user.save()
                    .then(() => {
                        if(auction.seller===id2) auction.sellerRating=true;
                        else auction.bidderRating=true;
                        auction.save()
                            .then(auction => res.json(auction))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
             })
            .catch(err => res.status(400).json('Error: ' + err));
    });
});

router.route('/searchDownloads').post(auth,(req,res)=>{
    var query1=null;
    var query=null;
    var query2=null;
    query={};
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
    query1={$and : [{ends :{$exists : true}},{ends : {$lt : date }}]};
    query=Object.assign(query,query1);
    User.findById(req.id)
        .then(user=>{
            if(user.username!=="admin")
                return res.status(400).json("Token not valid(not admin)!");
            Auction.find(query)
                .then(auctions=>res.json(auctions.filter((auction)=>
                    ((String(auction.amount)==="undefined" &&
                    auction.first_bid>=Number(req.body.min) && 
                    auction.first_bid<=Number(req.body.max))||
                    (auction.amount>=Number(req.body.min) && 
                    auction.amount<=Number(req.body.max) )))))
                .catch(err=>res.status(400).json('Error:'+err));
        })
        .catch(err => res.status(400).json('Error: ' + err)); 
});
router.route('/create').post(auth,(req,res)=>{
    var builder = require('xmlbuilder');
    User.findById(req.id)
    .then(user=>{
    if(user.username!=="admin")
        return res.status(400).json("Token not valid(not admin)!");    
    Auction.findById(req.body.id).exec(function(err,auction){
        if(err) return res.status(400).json('Error:'+err)
        if(!auction) return res.status(400).json('Auction id was not found!');
        if(String(auction.ends)==="undefined")
            return res.status(400).json('Auction has not started!');
        if(auction.ends>new Date()) 
            return res.status(400).json('Auction has not finished yet!');
        name = auction.name;
        amount = auction.amount;
        first_bid = auction.first_bid;
        country = auction.country;
        started = auction.started;
        ends = auction.ends;
        description = auction.description;          
        coords = auction.address;
        num_of_bids = auction.number_of_bids;
        
        var xml = builder.create('Item')
        xml.att('ItemID',req.body.id )
        var item = xml.ele('Name',name)
        for(category of auction.categories){
            var item = xml.ele('Category',category)
        }
        var item = xml.ele('Currently',amount+"€")  
        var item = xml.ele('First_Bid',first_bid+"€")
        var item = xml.ele('Buy_Price',auction.buy_price+"€")
        var item = xml.ele('Number_of_Bids',num_of_bids)
        const query={auctionId:req.body.id};
        let a=[];
        Bid.find(query)
            .then(bids=>
                {
                    for(var i in bids){
                        User.findById(bids[i].bidder)
                             .then(user => {
                                 const obj = {
                        Bid:{
                            Bidder: {
                                "@UserID": user.username,
                                "@Rating": user.rating,
                            },
                            Location:user.address,
                            Country:user.country,
                            Time:bids[i].createdAt.toISOString(),
                            Amount: bids[i].offer+"€",
                        }
                    };
                    a.push(obj);
                    if(i==bids.length-1){
                        var item = xml.ele('Bids').ele(a);
                        var item = xml.ele('Location',coords)
                        var item = xml.ele('Country',country)
                        var item = xml.ele('Started',started.toISOString())
                        var item = xml.ele('Ends',ends.toISOString())
                        var item = xml.ele('Description',description)
                        .end();
                        fs.appendFile("./downloads/"+name+"_"+req.body.id+'.xml', xml, function (err) {
                            if (err){ 
                                res.status(400).json('Error: ' + err)
                            }else{
                            fs.readFile( "./downloads/"+name+"_"+req.body.id+'.xml', function(err, data) {
                                 if (err){ 
                                    res.status(400).json('Error: ' + err)
                                }else {
                                var json = parser.toJson(data);
                                fs.writeFileSync("./downloads/"+name+"_"+req.body.id+'.json', json);
                                res.json(true);
                                }
                            });
                            }
                        });
                        }
                             })
                             .catch(err => res.status(400).json('Error: ' + err));
                       
                    }

            })
            .catch(err => res.status(400).json('Error: ' + err));     
    });
    })
    .catch(err => res.status(400).json('Error: ' + err));     
                        
});
module.exports=router;