const express = require('express')
const router = express.Router()

const authenicateUser = require('../middleware/user-authentication')
const passwordController = require('../Controllers/password-controller')


router.post('/password/forgotpassword', passwordController.forgotPassword)
router.get('/password/resetpassword/:uuid', passwordController.sendResetPasswordForm)
router.get('/password/updatepassword/:uuid', passwordController.updatePassword)


module.exports = router