const express = require('express')
const router = express.Router()

const expenseController = require('../Controllers/expense-controller')
const authenicateUser = require('../middleware/user-authentication')


router.post('/add-expense', authenicateUser.authenticate, expenseController.addExpense)

module.exports = router