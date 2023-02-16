const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const cors = require('cors')

const app = express()  

app.use(cors())

app.use(bodyParser.json({extended:false}))

sequelize.sync()
.then()
.catch()

const getAllExpensesRoute = require('./Routes/getAllExpenses-route')
const addExpenseRoute = require('./Routes/addExpense-route')
const deleteExpenseRoute = require('./Routes/deleteExpense-route')


app.use(getAllExpensesRoute)
app.use(addExpenseRoute)
app.use(deleteExpenseRoute)


app.listen(5)