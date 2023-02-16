const express = require('express')
const Expense = require('../Models/expense-model');
const router = express.Router()

const loginController = require('../Controllers/expense-controller')

router.post('/user/login', loginController.login)

module.exports = router