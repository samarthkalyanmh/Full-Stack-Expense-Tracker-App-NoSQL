const mongoose = require('mongoose')

const Expense = new mongoose.Schema({

  amount : Number,
  description : String,
  category : String,
  UserId : {
    type : mongoose.SchemaTypes.ObjectId, 
    ref:'users'
  }
})

module.exports = mongoose.model('expenses', Expense)

