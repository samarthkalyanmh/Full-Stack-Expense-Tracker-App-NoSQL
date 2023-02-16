const express = require('express')
const Expense = require('../Models/expense-model');
const router = express.Router()

const expenseController = require('../Controllers/expense-controller')

router.post('/user/signup', expenseController.signup)

module.exports = router