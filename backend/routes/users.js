const router=require('express').Router();
let User=require('../models/user.model');
const bcrypt=require('bcryptjs');
const config=require('../config');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
router.route('/login').post((req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const query={username:req.body.username};
    User.findOne(query).exec(function(err,user){
       if(err) return res.status(400).json('Error:'+err)
       if(!user) return res.status(400).json('Username not found!');
       bcrypt.compare(password,user.password)
            .then(bool=>{
                if(!bool) return res.status(400).json('Wrong password!');
                jwt.sign({id:user.id,},config.jwtSecret,(err,token)=>{
                                if(err) return  res.status(400).json('Error:'+err);    
                                const listed=user.listed;
                                const rating=user.rating;
                                res.json({token,username,listed,rating});
                });
            })
            .catch(err=>res.status(400).json('Error:'+err));
    });  
});
router.route('/signup').post((req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const name=req.body.name;
    const surname=req.body.surname;
    const email=req.body.email;
    const address=req.body.address;
    const PhoneNumber=Number(req.body.PhoneNumber);
    const AFM=req.body.AFM;
    const query={username:req.body.username};
    const listed=false;
    const rating="Not Rated";
    const number_of_ratings=0;
    const country=req.body.country;
    User.findOne(query).exec(function(err,user){
       if(err)  return res.status(400).json('Error:'+err);
       if(user) return res.status(400).json('Username already in use');
       const query={email:req.body.email};
       User.findOne(query).exec(function(err,user){
           if(err) return res.status(400).json('Error:'+err)
           if(user) return res.status(400).json('Email already in use');    
           const newUser=new User({username,password,name,surname,email,PhoneNumber,address,AFM,listed,rating,number_of_ratings,country});
           bcrypt.genSalt(10,(err,salt)=>{
                if(err) return res.status(400).json('Error:'+err);
               bcrypt.hash(newUser.password,salt,(err,hash)=>{
                   if(err) return res.status(400).json('Error:'+err);
                   newUser.password=hash;
                   newUser.save()
                        .then(user=> {
                            jwt.sign({id:user.id,},config.jwtSecret,{expiresIn:3600},(err,token)=>{
                                if(err) return  res.status(400).json('Error:'+err);    
                                res.json({rating,token,username,listed});
                            });
                        })
                        .catch(err=>res.status(400).json('Error:'+err));
               });
           });
       });
    });   
});
router.route('/admin').get(auth,(req,res)=>{
    const query={listed:false};
    User.findById(req.id)
        .then(user=>{
            if(user.username!=="admin")
                return res.status(400).json("Token not valid(not admin)!");
            User.find(query)
                .select('-password')
                .then(users=>res.json(users))
                .catch(err=>res.status(400).json('Error:'+err));
        })
        .catch(err=>res.status(400).json('Error:'+err));
});
router.route('/:id').delete(auth,(req, res) => {
    User.findById(req.id)
        .then(user=>{
            if(user.username!=="admin")
            return res.status(400).json("Token not valid(not admin)!")
            User.findByIdAndDelete(req.params.id)
                .then(() => res.json('User deleted.'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err=>res.status(400).json('Error:'+err));

});
router.route('/update/:id').get(auth,(req, res) => {
    User.findById(req.id)
        .then(user=>{
            if(user.username!=="admin")
            return res.status(400).json("Token not valid(not admin)!");
            User.findById(req.params.id)
                .then(user => {
                user.listed=true;
                user.save()
                    .then(() => res.json('User updated!'))
                    .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err=>res.status(400).json('Error:'+err));
});
router.get('/auth', (req, res) => {
    const token=req.header('x-auth-token');
    if(!token) return res.json('Guest!');
    try{
        const decoded=jwt.verify(token,config.jwtSecret);
        req.id=decoded.id;
    }
    catch(e) {
        return res.status(400).json('Token not valid!');
    }
    User.findById(req.id)
        .select('username listed rating')
        .then(user => {
            res.json(user)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports=router;