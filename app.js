const express = require('express');
const bodyParser = require('body-parser');

const User = require('./Models/userLogin-model')
const Expense = require('./Models/expense-model')


const sequelize = require('./util/database');
const cors = require('cors')

const app = express()  

app.use(cors())

app.use(bodyParser.json({extended:false}))

const getAllExpensesRoute = require('./Routes/getAllExpenses-route')
const addExpenseRoute = require('./Routes/addExpense-route')
const deleteExpenseRoute = require('./Routes/deleteExpense-route')
const signupRoute = require('./Routes/signup-route')
const loginroute = require('./Routes/login-route')

app.use(signupRoute)
app.use(loginroute)
app.use(getAllExpensesRoute)
app.use(addExpenseRoute)
app.use(deleteExpenseRoute)

User.hasMany(Expense)
Expense.belongsTo(User)

sequelize.sync()
.then()
.catch()

app.listen(5)