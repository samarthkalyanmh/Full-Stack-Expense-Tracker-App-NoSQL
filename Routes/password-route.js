const express = require('express')
const router = express.Router()

const authenicateUser = require('../middleware/user-authentication')
const passwordController = require('../Controllers/password-controller')


router.post('/password/forgotpassword', passwordController.forgotPassword)

module.exports = router