const express = require('express')
const bodyParser = require('body-parser')

//What does this below code do exactly?
// app.use(express.static('public'))
require('dotenv').config()
const path = require('path')

const mongoose = require('mongoose')

const morgan = require('morgan')
const fs = require('fs')
// const helmet = require('helmet')

const cors = require('cors')

const app = express()

//setting secure headers for responses 
// app.use(helmet())

app.use(cors())

const accessLogStream =  fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))

app.use(bodyParser.json({extended:false}))

const signupRoute = require('./Routes/signup-route')
const loginroute = require('./Routes/login-route')
const expenseRoute = require('./Routes/expense-route')
const passwordRoute = require('./Routes/password-route')
const premiumRoute = require('./Routes/premium-route')
const purchaseRoute = require('./Routes/purchase-route')

app.use(signupRoute)
app.use(loginroute)
app.use(expenseRoute)
app.use(passwordRoute) 
app.use(premiumRoute)
app.use(purchaseRoute)

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
});

// (function(){ 

//     mongoose.connect(process.env.MONGODB_ATLAS_URL)
//     .then(() => {
//         console.log('Connected to atlas!')
//         app.listen(3000)
//     })
//     .catch(err => console.log(err))
// })()

mongoose.connect(process.env.MONGODB_ATLAS_URL)
    .then(() => {
        console.log('Connected to atlas!')
        app.listen(3000)
    })
    .catch(err => console.log(err))