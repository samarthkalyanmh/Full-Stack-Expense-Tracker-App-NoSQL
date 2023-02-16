const express = require('express')
const expenseController = require('../Controllers/expense-controller') 

const router = express.Router()

router.get('/get-all-expenses', expenseController.getAllExpenses)

module.exports = router