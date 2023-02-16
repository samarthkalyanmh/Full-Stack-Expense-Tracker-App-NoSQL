const express = require('express')
const router = express.Router()

const expenseController = require('../Controllers/expense-controller')

router.post('/add-expense', expenseController.addExpense)

module.exports = router