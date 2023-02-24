const Expense = require('../Models/expense-model')
const User = require('../Models/user-model')

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

        const val = await User.findOne({ where: { id: UserId } })
        await req.user.update({totalExpense: val.totalExpense + Number(amount)})

        res.status(201).json(data)
        
    } catch(err) {
        res.status(500).json(err)
    }
}


//Should optimise below code
const deleteExpense = async (req, res, next) => {
    try{
        const uid = req.params.id

        const amountOfDeletedExpense = await Expense.findOne({where: {id: uid, UserId: req.user.id}})

        await Expense.destroy({where: {id: uid, UserId: req.user.id}})


        const val = await User.findOne({ where: { id: req.user.id } })

        await req.user.update({totalExpense: val.totalExpense - Number(amountOfDeletedExpense.amount)})

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