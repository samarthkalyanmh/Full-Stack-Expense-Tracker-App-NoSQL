const express = require('express')
const router = express.Router()
const Expense = require('../Models/expense-model'); 
const expenseController = require('../Controllers/expense-controller')


router.delete('/delete-expense/:id', expenseController.deleteExpense)

module.exports = router