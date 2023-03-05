const express = require('express')
const router = express.Router()

const expenseController = require('../Controllers/expense-controller')
const premiumController = require('../Controllers/premium-controller')
const authenicateUser = require('../middleware/user-authentication')


router.post('/add-expense', authenicateUser.authenticate, expenseController.addExpense)

router.delete('/delete-expense/:id', authenicateUser.authenticate, expenseController.deleteExpense)

router.get('/get-all-expenses', authenicateUser.authenticate, expenseController.getAllExpenses)

router.get('/download-expense', authenicateUser.authenticate, premiumController.downloadExpense)

module.exports = router