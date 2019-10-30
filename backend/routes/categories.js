const router=require('express').Router();
let Category=require('../models/category.model');
let User=require('../models/user.model');
const auth=require('../middleware/auth');
router.route('/add').post(auth,(req,res)=>{
    name=req.body.name;
    parents=req.body.parents;
    User.findById(req.id)
        .then(user=>{
            if(user.username!=="admin") return res.status(400).json("Token not valid(not admin)!");
            const query={name : name,parents:parents};
            Category.findOne(query).exec(function(err,category){
                if(err)  return res.status(400).json('Error:'+err)
                if(category) return res.status(400).json('Category name already in use');
                const newCategory=new Category({name:name,parents:parents});
                newCategory.save()
                    .then(()=>res.json(newCategory))
                    .catch(err=>res.status(400).json('Error:'+err));
            });
        })
        .catch(err=>res.status(400).json('Error:'+err));   
});
router.route('/').get((req,res)=>{
    Category.find()
        .then(categories=>res.json(categories))
        .catch(err=>res.status(400).json('Error:'+err));
});
router.route('/delete/:id').post(auth,(req,res)=>{
    name=req.body.name;
    User.findById(req.id)
        .then(user=>{
            if(user.username!=="admin") return res.status(400).json("Token not valid(not admin)!")
            Category.findByIdAndDelete(req.params.id)
                .then(() => {
                    Category.deleteMany({parents: name})
                    .then(()=>res.json("Category and subcategories deleted!"))
                    .catch(err=>res.status(400).json('Error:'+err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err=>res.status(400).json('Error:'+err));
});
module.exports=router;