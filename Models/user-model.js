const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const User = new mongoose.Schema({

  name : String,
  email : String,
  password : String,
  isPremiumUser : Number,
  totalExpense: {
    type: Number,
    default: 0
  }
})


module.exports = mongoose.model('users', User)

