const express = require('express');
const router = express.Router();
const User =require("../models/user");
const Orders =require("../models/order");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//const {verifyToken, verifyAdminToken} = require("../middleware/authMiddleware");
function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token,"hello secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            } else {
                console.log("this is the decoded toekan")
                console.log(decodedToken);
                req.locals = decodedToken;
                next();
            }})
        } 
    else {
        console.log("HI");
    }
};
router.get('/login',(req,res)=>{
    res.render("login.ejs");
})
// getting all the users without their password hash
router.get('/',async(req,res)=>{
    //res.render("login",{title:"login system"});
    const userList = await User.find().select('-passwordHash');
    if(!userList){
        return res.status(500).json({success:false});
    }
    res.send(userList);
});
router.get('/register',(req,res)=>{
    res.render("register.ejs");
})
router.get('/logout',(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.render("login.ejs");
})
//login a user Api
router.post('/login',async(req,res)=>{
    const user = await User.findOne({email:req.body.email});
    require('dotenv').config()
    const secret = process.env.SECRET;
    if(!user){
        return res.status(400).send("the user not found");
    }
    if(user && bcrypt.compareSync(req.body.passwordHash,user.passwordHash)){
        const token = jwt.sign({
            isAdmin : user.isAdmin,
            email:user.email,
            name:user.name,
            userId:user._id
        },
        "hello secret",  //secret is like a password which we used to create web tokens
        {expiresIn:'1d'}
    )
        res.cookie('jwt',token);    
        res.status(200).json({user:user._id,name:user.name});
    }
    else{
        return res.status(400).send("password is wrong");
    }
})

router.post('/process_login', async (req, res) => {
    return res.redirect('/api/v1/user/login');
})

//post/register a new user.
router.post('/register', async (req,res)=>{
    console.log(req.body);
    let newuser = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
    })
    newuser = await newuser.save();
    if(!newuser){
        return res.status(404).send('the user cant be created')
    }
    res.status(200).json({user:newuser.name});
})


// get the profile of the user
router.get("/profile",verifyToken,async(req,res)=>{
    console.log("we are getting the page")
    const x=req.locals.userId;
    console.log(x)
    const user =await User.findById(x);
    console.log(user)
    const y=user._id;
    const orders = await Orders.find({user:y,status:"pending"})
    // console.log(order)
    res.render('profile.ejs',{data:user,data2:orders})
})
router.get("/updateprofile",verifyToken,async(req,res)=>{
    const z=req.locals.userId;
    const user=await User.findById(z);
    res.render("updateprofile.ejs",{data:user})
})
router.put("/updateprofile",verifyToken,async(req,res)=>{
    console.log("exit")
    const h=req.locals.userId;
    const user = await User.findByIdAndUpdate(
        h,
        {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            street:req.body.street,
            apartment:req.body.apartment,
            zip:req.body.zip,
            city:req.body.city,
            country:req.body.country 
        },
        {new:true},
    )
    // هنا ه redirect علي ال profile تاني باستخدام اال local storage اللي انتي بتقولي عليه يا سلمي
    res.redirect(`/api/v1/user/updateprofile`)
})
router.put("/cancel/:id",verifyToken,async(req,res)=>{
    const b=req.params.id;
    const order=await Orders.findByIdAndUpdate(
        req.params.id,{
            status:"cancled"
        },
        {new:true},
    )
    res.redirect(`/api/v1/user/profile`) /*ال id اللي مكتوب هنا دا هيتجاب بالتوكين وكدة كدة ال 
    path دا مش هيعمل مشكلة لانه لازم يبقي authinc عشان يدخله*/
})
module.exports = router;