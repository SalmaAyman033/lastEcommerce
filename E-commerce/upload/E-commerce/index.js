const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Product = require('./models/product');
const category = require('./models/category');
//Routers
const productsRouter = require("./routers/products");
const categoryRouter = require("./routers/categorys");
const app = express();
//middleware
app.use(bodyparser.json()); // my appliction or my backend will understand the json which is send from the frontend
app.use(morgan('tiny'));
app.use('/api/v1/products',productsRouter);
app.use('/api/v1/categories',categoryRouter);
mongoose.connect('mongodb+srv://salmamelbanna:salma22281533@cluster0.kfowmi1.mongodb.net/eshop-database?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
    app.listen(4000,()=>{
        console.log('http://localhost:4000/api/v1/products');
    })
}).catch((err)=>{
    console.log(err);
})

