const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const User = new mongoose.Schema({

  name : String,
  email : String,
  password : String,
  isPremiumUser : Number,
  totalExpense: Number
})


module.exports = mongoose.model('Users', User)

