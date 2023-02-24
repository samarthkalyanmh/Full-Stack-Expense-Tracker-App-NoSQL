const express = require('express')
const router = express.Router()

const purchaseController = require('../Controllers/purchase-controller')
const authenicateUser = require('../middleware/user-authentication')


router.get('/purchase/premium', authenicateUser.authenticate, purchaseController.purchasePremium)

router.post('/updateTransactionStatus', authenicateUser.authenticate, purchaseController.updateTransactionStatus)

router.post('/updateTransactionStatus/failed', authenicateUser.authenticate, purchaseController.updateTransactionStatusFailed)


module.exports = router