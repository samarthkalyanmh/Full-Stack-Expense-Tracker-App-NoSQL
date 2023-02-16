const Expense = require('../Models/expense-model');
const User = require('../Models/userLogin-model');


const getAllExpenses = async (req, res, next) => {

    try{
        const allExpenses = await Expense.findAll()
        res.json(allExpenses)
    } catch(err){
        res.status(500).send(err)
    }
    
}

const addExpense = async (req, res, next) => {

    try{

        const amount = req.body.amount
        const description = req.body.description
        const category = req.body.category

        const data = await Expense.create({
                                    amount: amount,
                                    description: description,
                                    category: category
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
        await Expense.destroy({where: {id: uid}})
        res.sendStatus(200)

    } catch(err){
        res.send(err)
    }
    
}

//
const editExpense = async (req, res, next) => {
    try{
        

    } catch(err){

    }
}

const login = async (req, res, next) => {
    try{
        if(!req.body.name || !req.body.email){
            throw new Error('Both are mandatory fields')
        }
        else{
            const name = req.body.name
            const email = req.body.email
    
            const data = await User.create({
                name: name,
                email: email
            })
            .then()
            .catch()
    
            res.status(201).json(data)
        }
        
    } catch(err){
        res.send(500).json(err)
    }
}


module.exports = {
    getAllExpenses,
    addExpense,
    deleteExpense, 
    editExpense,
    login
}