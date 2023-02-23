const Expense = require('../Models/expense-model');

const getAllExpenses = async (req, res, next) => {

    try{
        // req.user.getExpenses() // You can also use this function provided by sequelize itself

        const allExpenses = await Expense.findAll({ where: {userId: req.user.id}})
        res.status(201).json(allExpenses)

    } catch(err){
        res.status(500).send(err)
    }
}

const addExpense = async (req, res, next) => {

    try{

        const amount = req.body.amount
        const description = req.body.description
        const category = req.body.category

        console.log('req.user is >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.user)

        const data = await Expense.create({
                                    amount: amount,
                                    description: description,
                                    category: category,
                                    UserId: req.user.id
                                })
                                .then()
                                .catch()

        res.status(201).json(data)
        
    } catch(err) {
        console.log('Error is ', err)
        res.send(500).json(err)
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