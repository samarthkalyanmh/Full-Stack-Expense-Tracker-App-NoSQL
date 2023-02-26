const express = require('express')
const router = express.Router()

const expenseController = require('../Controllers/expense-controller')
const authenicateUser = require('../middleware/user-authentication')


router.post('/add-expense', authenicateUser.authenticate, expenseController.addExpense)

router.delete('/delete-expense/:id', authenicateUser.authenticate, expenseController.deleteExpense)

router.get('/get-all-expenses', authenicateUser.authenticate, expenseController.getAllExpenses)

module.exports = router