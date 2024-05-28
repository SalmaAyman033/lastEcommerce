const express = require('express');
const router = express.Router();
const Product =require("../models/product")
const Category =require("../models/category")
const {verifyToken, verifyAdminToken} = require("../middleware/authMiddleware");
//getting all the products
router.get('/',verifyToken,async (req,res)=>{
    const products =await Product.find().select('name image price description _id id');
    const CategoryList =await Category.find().select('name');
    if(!products || ! CategoryList){
        res.status(500).json({success:false})
    }
    const name = req.locals.name
    console.log(req.locals.name)
    res.render('index', { products, CategoryList,name });
    //res.status(200).json({products});
})
router.get('/s',async (req,res)=>{
    const products =await Product.find().select('name image price description _id id category');
    const CategoryList =await Category.find().select('name');
    if(!products || ! CategoryList){
        res.status(500).json({success:false})
    }
    //res.render('index', { products, CategoryList });
    res.status(200).json({products});
})
//
router.get('/m',async (req,res)=>{
    const CategoryList =await Category.find().select('name');
    if(! CategoryList){
        res.status(500).json({success:false})
    }
    res.status(200).json({CategoryList});
})
// getting one product
router.get('/:id',async (req,res)=>{
    const product =await Product.findById(req.params.id).select('name image description price');
    if(!product){
        res.status(500).json({success:false})
    }
    res.render("product-details.ejs",{product});
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