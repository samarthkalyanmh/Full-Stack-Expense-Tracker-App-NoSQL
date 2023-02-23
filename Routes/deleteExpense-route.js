const express = require('express')
const router = express.Router()

const expenseController = require('../Controllers/expense-controller')
const authenicateUser = require('../middleware/user-authentication')



router.delete('/delete-expense/:id', authenicateUser.authenticate, expenseController.deleteExpense)

module.exports = router