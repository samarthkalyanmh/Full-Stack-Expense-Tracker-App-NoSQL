const mongoose = require('mongoose')

const Order = new mongoose.Schema({
  
    paymentid : String,
    orderid : String,
    status : String,
    UserId : {
        type : mongoose.SchemaTypes.ObjectId, 
        ref:'users'
    }
})

module.exports = mongoose.model('orders', Order)
