const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('./middleware');
// enable us to use mongoose database.
const mongoose = require('mongoose');
const methodOverride = require("method-override");

// to use the public folder which contain css and js files.
app.use(express.static('public'));//middle ware
app.use(methodOverride("_method"));


//middleware
app.use(cookieparser());
//the middleware is checking everything going to the server before it gets excuted.
const morgan = require('morgan');
app.use(morgan('tiny'));

// requiring models that contain database schemas.
const Product = require('./models/product');
const category = require('./models/category');
const user = require('./models/user');
const order = require('./models/order');
const orderItem = require('./models/orderitem');

require('dotenv').config()

app.set('view engine','ejs');



// parse application/x-www-form-urlencoded
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) // parse application/json  
// my appliction or my backend will understand the json which is send from the frontend



app.use((err,req,res,next )=>{
    if(err){
        res.status(500).json({message:"error in the server"})
    }
})

// app.get('/api/v1/products',requireAuth,async (req,res)=>{
//     console.log("test");
//     const products =await Product.find().select('name image -_id');
//     if(!products){
//         res.status(500).json({success:false})
//     }
//     res.send(products);
// })


//Routers
const productsRouter = require("./routers/products");
const categoryRouter = require("./routers/categorys");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const adminRouter = require("./routers/admin");
//const orderItemsRouter = require("./routers/users");



app.use('/api/v1/products',productsRouter);
app.use('/api/v1/categories',categoryRouter);
app.use('/api/v1/user',usersRouter);
app.use('/api/v1/order',ordersRouter);
app.use('/api/v1/admin',adminRouter);

app.get('/api/v1',async (req,res)=>{
    res.render('mainn');
})






// connecting to the database and running the appliction.
mongoose.connect('mongodb+srv://salma:salmasalma@cluster0.nf2x0sv.mongodb.net/shopping-cart?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    app.listen(4000,()=>{
        console.log('http://localhost:4000/api/v1');
    })
    })
.catch((err)=>{
    console.log(err);
    })

