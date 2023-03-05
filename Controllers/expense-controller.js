const Expense = require('../Models/expense-model')
const User = require('../Models/user-model')
const sequelize = require('../util/database')
require('dotenv').config()
const S3Services = require('../Services/S3-services')
const UserServices = require('../Services/User-services')

const getAllExpenses = async (req, res, next) => {

    try{
        // req.user.getExpenses() // You can also use this function provided by sequelize itself
        const allExpenses = await Expense.findAll({ where: {userId: req.user.id}})
        res.status(201).json(allExpenses)

    } catch(err){
        console.log(err)
        res.status(500).json(err)    
    }
}

const addExpense = async (req, res, next) => {

    //This below declaration should be outside the try block coz if we declare it inside try block, then we can't access it in catch block
    const t = await sequelize.transaction()

    try{
        const amount = req.body.amount
        const description = req.body.description
        const category = req.body.category
        const UserId = req.user.id

        if(amount === '' || !description || !category){
            throw new Error("Bad Parameters")
        }

        // Can use this magic function as well (Provided by sequelize)
        // const data = await req.user.createExpense({ amount, description, category, UserId}) 
        const data = await Expense.create({ amount, description, category, UserId}, {transaction: t})

        const currentTotalExpense = await User.findOne({ where: { id: UserId } })
        await req.user.update({totalExpense: currentTotalExpense.totalExpense + Number(amount)}, {transaction: t})

        await t.commit()
        res.status(201).json(data)
        
    } catch(err) {
        await t.rollback()
        console.log(err)
        res.status(500).json(err)
    }
}


//Should optimise below code
const deleteExpense = async (req, res, next) => {

    //This below declaration should be outside the try block coz if we declare it inside try block, then we can't access it in catch block
    const t = await sequelize.transaction()

    try{    
        const uid = req.params.id

        const amountOfDeletedExpense = await Expense.findOne({where: {id: uid, UserId: req.user.id}})

        await Expense.destroy({where: {id: uid, UserId: req.user.id}, transaction: t})


        const val = await User.findOne({ where: { id: req.user.id }})

        await req.user.update({totalExpense: val.totalExpense - Number(amountOfDeletedExpense.amount)}, {
            transaction: t
        })

        await t.commit()
        res.sendStatus(200)

    } catch(err){
        console.log(err)
        t.rollback()
        res.status(500).json(err)
    }   
}


module.exports = {
    getAllExpenses,
    addExpense,
    deleteExpense
}