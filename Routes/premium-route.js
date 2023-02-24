const express = require('express')
const router = express.Router()

const authenicateUser = require('../middleware/user-authentication')
const premiumController = require('../Controllers/premium-controller')


router.get('/premium/showleaderboard', authenicateUser.authenticate, premiumController.showLeaderBoard)

module.exports = router
