const express = require('express')
const router = express.Router()
const Expense = require('../Models/expense-model'); 

const sequelize = require('../util/database');


router.delete('/delete-expense/:id', async (req, res, next) => {
    const uid = req.params.id
    await Expense.destroy({where: {id: uid}})
    res.sendStatus(200)
})

module.exports = router