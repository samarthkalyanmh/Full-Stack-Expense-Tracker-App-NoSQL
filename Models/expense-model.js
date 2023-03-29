const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Expense = new mongoose.Schema({

  amount : Number,
  description : String,
  category : String,
  UserId : [{
    type : Schema.Types.ObjectId, ref:'Users'
  }]


})

module.exports = mongoose.model('Expenses', Expense)

