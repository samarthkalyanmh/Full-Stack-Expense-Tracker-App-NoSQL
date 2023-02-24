const Razorpay = require('razorpay')
const Order = require('../Models/order-model')
const userController = require('./user-controller')
require('dotenv').config()


const purchasePremium = async (req, res, next) => {
    try{
        /* Creating new razorpay object and passing API key and keyId. Now razorpay can identify which company is sending payment request*/
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID, 
            key_secret: process.env.RAZORPAY_KEY_SECRET 
        })
        const amount = 4500000
        
        //Creating order in razorpay
        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err))
            }
            //saving order details in DataBase
            req.user.createOrder({orderid: order.id, status:'PENDING'})
            .then(() => {
                return res.status(201).json({order, key_id: rzp.key_id})
            })
            .catch(err => {
                throw new Error(err)
            })
        })

    } catch(err){
        console.log(err)
        res.status(403).json({message:'something went wrong in razorpay order creation process', error: err})
    }
}

const updateTransactionStatus = async (req, res, next) => {

    try {
        const userId = req.user.id
        const name = req.user.name

        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) 
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ isPremiumUser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId, name) }); 
        }).catch((error ) => {
            throw new Error(error)
        })   
                
    } catch (err) {
        console.log(err); 
        res.status(403).json({ errpr: err, message: 'Something went wrong' })

    }
}

//Not working yet
const updateTransactionStatusFailed = async (req, res, next) => {
    try{
        const userId = req.user.id
        const name = req.user.name

        console.log('transaction failed>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

        const { order_id } = req.body
        const order  = await Order.findOne({where : {orderid : order_id}}) 

        const promise1 =  order.update({ paymentid: 'FAILED', status: 'FAILED'}) 
        const promise2 =  req.user.update({ isPremiumUser: false }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(403).json({result: false, message: "Transaction Failed machi", token: userController.generateAccessToken(userId, name) }); 
        }).catch((error ) => {
            throw new Error(error)
        }) 

    } catch(err){
        console.log(err)
    }
}

module.exports = {
    purchasePremium,
    updateTransactionStatus,
    updateTransactionStatusFailed
}