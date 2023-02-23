const express = require('express')
const expenseController = require('../Controllers/expense-controller') 
const authenicateUser = require('../middleware/user-authentication')

const router = express.Router()

router.get('/get-all-expenses', authenicateUser.authenticate, expenseController.getAllExpenses)

module.exports = router