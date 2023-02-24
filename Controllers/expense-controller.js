const Expense = require('../Models/expense-model');


const getAllExpenses = async (req, res, next) => {

    try{
        // req.user.getExpenses() // You can also use this function provided by sequelize itself

        const allExpenses = await Expense.findAll({ where: {userId: req.user.id}})
        res.status(201).json(allExpenses)

    } catch(err){
        res.status(500).send(err)
        console.log('error is >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err)
    }
}

const addExpense = async (req, res, next) => {
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
        const data = await Expense.create({ amount, description, category, UserId})
        res.status(201).json(data)
        
    } catch(err) {
        res.status(500).json(err)
    }
}

const deleteExpense = async (req, res, next) => {
    try{
        const uid = req.params.id
        await Expense.destroy({where: {id: uid, UserId: req.user.id}})
        res.sendStatus(200)

    } catch(err){
        res.send(err)
    }   
}

module.exports = {
    getAllExpenses,
    addExpense,
    deleteExpense
}