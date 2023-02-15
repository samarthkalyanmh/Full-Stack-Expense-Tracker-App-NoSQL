const express = require('express')
const Expense = require('../Models/expense-model');
const router = express.Router()

router.post('/add-expense', async (req, res, next) => {

    const amount = req.body.amount
    const description = req.body.description
    const category = req.body.category

    // console.log(req.body)
    
    try{
        const data = await Expense.create({
                                    amount: amount,
                                    description: description,
                                    category: category
                                })
                                .then()
                                .catch()

        console.log('returned data from database is ', data)
                    // res.status(201).json({addedExpenseDetails: data})
        res.json(data)
        
    } catch(err) {
        console.log('Error is ', err)
    }
    
})

module.exports = router