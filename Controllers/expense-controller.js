const Expense = require('../Models/expense-model')
const User = require('../Models/user-model')
require('dotenv').config()

const getAllExpenses = async (req, res, next) => {
    try {
        
        //writing + here before req.query.page helps convert string to number
        const PAGE = +req.query.page || 1
        const ITEMS_PER_PAGE = +req.query.count || 3

        const userId = req.user._id
      
        const count = await Expense.count({UserId : userId})

        // await Expense.find({UserId : userId}, {limit: ITEMS_PER_PAGE, skip: (PAGE - 1)*ITEMS_PER_PAGE})

        await Expense.find({UserId: userId}).skip((PAGE - 1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
            .then((rows) => {
                res.json({
                    rows : rows,
                    currentpage : PAGE,
                    hasnextpage : ITEMS_PER_PAGE * PAGE < count,
                    nextpage : PAGE + 1,
                    haspreviouspage : PAGE > 1,
                    previouspage : PAGE - 1,
                    lastpage : Math.ceil(count/ITEMS_PER_PAGE)
                })
            })

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal Server Error 500', err: err})
    }
}

const addExpense = async (req, res, next) => {

    //This below declaration should be outside the try block coz if we declare it inside try block, then we can't access it in catch block
    
    // const t = await sequelize.transaction()

    try{
        //NEW CODE
        const amount = req.body.amount
        const description = req.body.description
        const category = req.body.category
        const UserId = req.user._id

        if(amount === '' || !description || !category){
            throw new Error("Bad Parameters")
        } 

        const data = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            UserId: UserId
        })

        await User.updateOne({ _id: UserId}, {$inc: {totalExpense: data.amount}})

        res.status(201).json(data)
        
        
    } catch(err) {
        // await t.rollback()
        console.log(err)
        res.status(500).json(err, {message: 'Internal Server Error 500'})
    }
}


//Should optimise below code
const deleteExpense = async (req, res, next) => {

    //This below declaration should be outside the try block coz if we declare it inside try block, then we can't access it in catch block
    // const t = await sequelize.transaction()

    try{    
        const uid = req.params.id

        const amountOfDeletedExpense = await Expense.findOne({_id: uid, UserId: req.user._id})

        await Expense.deleteOne({_id: uid, UserId: req.user._id})

        await User.updateOne({_id: req.user._id}, {$inc: {totalExpense: -amountOfDeletedExpense.amount}})

        res.sendStatus(200)

    } catch(err){
        console.log(err)
        res.status(500).json(err, {message: 'Internal Server Error 500'})
    }   
}

module.exports = {
    getAllExpenses,
    addExpense,
    deleteExpense
}