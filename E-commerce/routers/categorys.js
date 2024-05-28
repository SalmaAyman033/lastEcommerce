const express = require('express');
const router = express.Router();
const Category =require("../models/category")
//getting all the categories.
router.get('/',async (req,res)=>{
    const CategoryList =await Category.find();
    if(!CategoryList){
        res.status(500).json({success:false})
    }
    res.status(200).send(CategoryList);
})
//creating new category.
router.post('/',async(req,res)=>{
    let category = new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
    })
    category = await category.save();
    if(!category){
        return res.status(404).send('the category cant be created')
    }
    res.send(category);
})
//updating the category.
router.put('/:id',async (req,res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color,
        },
        {new:true},

    )
    if(category){
        return res.status(200).json({success:true,message:'the category has been updated'})
    }
    else{
        return res.status(404).json({success:false,message:"category"})
    }

})
//Delete a category.
router.delete('/:id',(req,res)=>{
    Category.findByIdAndDelete(req.params.id).then(category => {
        if(category){
            return res.status(200).json({success:true,message:'the category has been deleted'})
        }
        else{
            return res.status(404).json({success:false,message:"category"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
})
module.exports = router;