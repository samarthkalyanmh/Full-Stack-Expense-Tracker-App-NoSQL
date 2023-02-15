const express = require('express')
const Expense = require('../Models/expense-model');  

const router = express.Router()

router.get('/get-all-expenses', async (req, res, next) => {
    const allExpenses = await Expense.findAll()
    res.json(allExpenses)
})

module.exports = router