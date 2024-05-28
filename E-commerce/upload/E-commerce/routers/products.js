const express = require('express');
const router = express.Router();
const Product =require("../models/product")
const Category =require("../models/category")
//getting all the products
router.get('/',async (req,res)=>{
    const products =await Product.find().select('name image -_id');
    if(!products){
        res.status(500).json({success:false})
    }
    res.send(products);
})
//getting one product
router.get('/:id',async (req,res)=>{
    const product =await Product.findById(req.params.id).populate('category'); //.populate("category")
    if(!product){
        res.status(500).json({success:false})
    }
    res.send(product);
})
// posting a new product
router.post('/',async (req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send("Invalid category")
    }
    const newProduct = new Product({
        name:req.body.name,
        description:req.body.description,
        richDescribtion:req.body.richDescribtion,
        image:req.body.image,
        images:req.body.images,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,
        dateCreated:req.body.dateCreated,
    })
    checkProduct = await newProduct.save();
    if(!checkProduct){
        return res.status(500).send('the product cant be created')
    }
    return res.send(checkProduct);

})
// updating a product
router.put('/:id',async (req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send("Invalid category")
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            description:req.body.description,
            richDescribtion:req.body.richDescribtion,
            image:req.body.image,
            images:req.body.images,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured,
            dateCreated:req.body.dateCreated,
        },
        {new:true},

    )
    if(!product){
        return res.status(500).send('the product cant be updated')
    }
    res.send(product)

})
router.delete('/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id).then(product => {
        if(product){
            return res.status(200).json({success:true,message:'the product has been deleted'})
        }
        else{
            return res.status(404).json({success:false,message:"product is invalid"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
})
//getting the number of products
router.get(`/get/count`,async (req,res)=>{
    const productCount =await Product.countDocuments()
    if(!productCount){
        res.status(500).json({success:false})
    }
    res.send({
        count:productCount
    });
})
//featered products
router.get(`/get/featured`,async (req,res)=>{
    const count = req.params.count ? req.params.count :0

    const productss =await Product.find({isFeatured:true}).limit(+count);
    if(!productss){
        res.status(500).json({success:false})
    }
    res.send({
        count:productss
    });
})


module.exports = router;