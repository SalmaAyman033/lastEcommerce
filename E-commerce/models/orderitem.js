const mongoose = require('mongoose');
const Product = require('./product');
const OrderItemSchema = mongoose.Schema({
    orderItems :{
        type:mongoose.SchemaTypes.Mixed,
        required:true
    },
    email: {
        type: String,
        required: true
    },
})
orderItem = mongoose.model('orderItem',OrderItemSchema);
module.exports = orderItem;