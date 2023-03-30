const mongoose = require('mongoose')

const User = new mongoose.Schema({

  name : String,
  email : String,
  password : String,
  isPremiumUser : Boolean,
  totalExpense: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('users', User)

