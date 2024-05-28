const express = require('express');
const router = express.Router();
const Order= require('../models/order');
const OrderItem = require('../models/orderitem');
const {verifyToken, verifyAdminToken} = require("../middleware/authMiddleware");
//rendering the cart page
router.get('/cart',verifyToken,async (req,res)=>{
    res.render('cart.ejs');
})

// getting all the orders.
router.get('/a', async (req, res) =>{
    const orderList = await Order.find();

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})
// getting specific order.
router.get('/:id', async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.render("cart",{order});
})
//posting an orderItem
router.post('/orderItem',async (req,res)=>{
    const newOrderItem = new OrderItem({
        orderItems:req.body.orderItems,
        email:req.body.email
    })
    checkOrderItem = await newOrderItem.save();
    if(!checkOrderItem){
        return res.status(500).send('the OrderItem cant be created')
    }
    return res.send(checkOrderItem);

})



//getting all order items
router.get('/', async (req, res) =>{
    const orderList = await OrderItem.find()  //.populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})



//posting an order.
router.post('/', async (req,res)=>{
    let order = new Order({
        orderItems: req.body.orderItems,
        orderItemsQ: req.body.orderItemsQ,
        orderItemsP: req.body.orderItemsP,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order) {
        return res.status(400).send('the order cannot be created!')
    }
    res.send(order);
})

//editing an order
router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
})

//editing an order item
router.put('/orderitem/:id',async (req, res)=> {
    const order = await OrderItem.findByIdAndUpdate(
        req.params.id,
        {
            orderItems: req.body.orderItems
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
})

//deleting an orderItem
router.delete('/:id',(req,res)=>{
    OrderItem.findByIdAndDelete(req.params.id).then(orderitem => {
        if(orderitem){
            return res.status(200).json({success:true,message:'the orderitem has been deleted'})
        }
        else{
            return res.status(404).json({success:false,message:"orderitem is invalid"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
})
//gettin the total sales
router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})

router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})
//getting userorderlist
router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})



module.exports =router;
