const mongoose = require('mongoose')

const ForgotPasswordRequests = new mongoose.Schema({
  uuid : String,
  isactive : Boolean,
  UserId : {
    type : mongoose.SchemaTypes.ObjectId, 
    ref:'users'
  }
})  

module.exports = mongoose.model('forgot_password_requests', ForgotPasswordRequests)
