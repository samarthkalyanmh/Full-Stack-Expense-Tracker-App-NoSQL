const express = require('express');
const bodyParser = require('body-parser');

const User = require('./Models/user-model')
const Expense = require('./Models/expense-model')
const Order = require('./Models/order-model')


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
const purchaseRoute = require('./Routes/purchase-route')

app.use(signupRoute)
app.use(loginroute)
app.use(purchaseRoute)
app.use(getAllExpensesRoute)
app.use(addExpenseRoute)
app.use(deleteExpenseRoute)


User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

sequelize.sync()
.then(() => {
    app.listen(5)
})
.catch(err => {
    console.log(err)
})

