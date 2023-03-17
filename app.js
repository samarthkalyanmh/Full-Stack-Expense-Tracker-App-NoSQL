const express = require('express')
const bodyParser = require('body-parser')
// app.use(express.static('public'))
require('dotenv').config()
const path = require('path')

const morgan = require('morgan')
const fs = require('fs')
// const helmet = require('helmet')

const User = require('./Models/user-model')
const Expense = require('./Models/expense-model')
const Order = require('./Models/order-model')
const ForgotPassword = require('./Models/forgot-password-model')
const FileURL = require('./Models/previous-downloads-fileURL-model')

const sequelize = require('./util/database')
const cors = require('cors')

const app = express()

//setting secure headers for responses 
// app.use(helmet())

app.use(cors())

const accessLogStream =  fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))

app.use(bodyParser.json({extended:false}))

const expenseRoute = require('./Routes/expense-route')
const signupRoute = require('./Routes/signup-route')
const loginroute = require('./Routes/login-route')
const purchaseRoute = require('./Routes/purchase-route')
const premiumRoute = require('./Routes/premium-route')
const passwordRoute = require('./Routes/password-route')

app.use(signupRoute)
app.use(loginroute)
app.use(purchaseRoute)
app.use(expenseRoute)
app.use(premiumRoute)
app.use(passwordRoute)

app.use((req, res) => {
    // console.log(req.url == '/Signup/signup.html')
    // console.log(`public/${req.url}`)

    // console.log(req.url)
    // if(req.url === '/Login/login.html' || req.url === '/Forgot-password/forgot-password.html' || req.url === '/Signup/signup.html' || req.url === '/Home/expensetracker-home.html' || req.url === '/Report-generation/report-generation.html'){
        res.sendFile(path.join(__dirname, `public/${req.url}`))

    // } else{
    //     res.sendFile(path.join(__dirname, `public/Login/login.html`))
    // } 
})


User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)

User.hasMany(FileURL)
FileURL.belongsTo(User)

sequelize.sync()
.then(() => {
    app.listen(3000)
}) 
.catch(err => {
    console.log(err)
})

