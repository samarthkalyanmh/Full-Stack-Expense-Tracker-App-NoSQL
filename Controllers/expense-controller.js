const Expense = require('../Models/expense-model');
const User = require('../Models/userLogin-model');
const bcrypt = require('bcrypt')


const getAllExpenses = async (req, res, next) => {

    try{
        const allExpenses = await Expense.findAll()
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
}

const login = async(req, res, next) => {

    try{ 


        if(!req.body.email || !req.body.password){
            return res.status(400).json("bad parameters")
        }
        console.log('email sent in request ', req.body.email)

        const userTryingToLogin = await User.findAll({where: {email: req.body.email}})
        console.log('User details ',userTryingToLogin)

        if(userTryingToLogin.length === 0){
           return res.status(404).json("user doesn't exist")

        } else if(userTryingToLogin[0].email === req.body.email){

            const usersStoredPassword = await User.findAll({where: {email: req.body.email}})

            if(usersStoredPassword[0].password === req.body.password){
                return res.status(200).json("login successful")
            } else{
                return res.status(400).json("login failed")
            }
        }
        
    } catch(err){
        console.log('err is ', err)
    }
}

const signup = async (req, res, next) => {
    try{

        const {name, email, password} = req.body

        const userTryingToSignup = await User.findAll({where: {email: req.body.email}})

        if(userTryingToSignup.length > 0){
            return res.status(400).json("user exists already, click on login")
        }

        if(!name || !email || !password){
            return res.status(400).json({message: "bad parameters, something is missing"})
        }
        else{
            bcrypt.hash(password, 10, async (err, hash) => {
                await User.create({ name, email, password: hash}) 
                res.status(201).json({message: 'Successfully created new user'})
            })
        }

    } catch(err){
        res.status(500).json(err)
    }
}

module.exports = {
    getAllExpenses,
    addExpense,
    deleteExpense, 
    editExpense,
    signup,
    login
}