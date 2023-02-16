const express = require('express')
const router = express.Router()
const expenseController = require('../Controllers/expense-controller')


router.delete('/delete-expense/:id', expenseController.deleteExpense)

module.exports = router