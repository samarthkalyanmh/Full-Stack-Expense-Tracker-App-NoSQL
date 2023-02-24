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

const expenseRoute = require('./Routes/expense-route')
const signupRoute = require('./Routes/signup-route')
const loginroute = require('./Routes/login-route')
const purchaseRoute = require('./Routes/purchase-route')
const premiumRoute = require('./Routes/premium-route')

app.use(signupRoute)
app.use(loginroute)
app.use(purchaseRoute)
app.use(expenseRoute)
app.use(premiumRoute)


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

