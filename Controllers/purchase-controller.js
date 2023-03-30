const Razorpay = require('razorpay')
const Order = require('../Models/order-model')
const userController = require('./user-controller')
const User = require('../Models/user-model')
require('dotenv').config()


const purchasePremium = async (req, res, next) => {
    try{
        /* Creating new razorpay object and passing API key and keyId. Now razorpay can identify which company is sending payment request*/
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID, 
            key_secret: process.env.RAZORPAY_KEY_SECRET 
        })


        const amount = 4500
        
        //Creating order in razorpay
        rzp.orders.create({amount, currency: 'INR'}, async (err, order) => {
            if(err){
                // throw new Error(JSON.stringify(err))
                return res.status(500).json({message: 'something went wrong in razorpay order creation process', err: err}) 
            }

            //saving order details in DataBase
            //req.user.createOrder({orderid: order.id, status:'PENDING'}) 
            Order.create({orderid: order.id, status:'PENDING'})

            .then(() => {
                return res.status(201).json({order, key_id: rzp.key_id})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: 'something went wrong in razorpay order creation process', err: err})
            })
        })  

    } catch(err){   
        console.log('Error in purchasePremium', err)
        res.status(500).json({message: 'something went wrong in razorpay order creation process', err: err})
    }
}

const updateTransactionStatus = async (req, res, next) => {

    // const t = await sequelize.transaction()
    try {
        
        const { payment_id, order_id} = req.body

        //const order  = await Order.findOne({orderid : order_id}) 

        // const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
        // const promise2 =  req.user.update({ isPremiumUser: true })

        const promise1 = Order.updateOne({orderid: order_id}, {paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 = User.updateOne({_id: req.user._id}, {isPremiumUser: true})


        //These below declarations must be made here itself to get the updated isPremiumUser status, if we make it above we will get old value which was null
        const userId = req.user._id
        const name = req.user.name
        const isPremiumUser = req.user.isPremiumUser 

        Promise.all([promise1, promise2]).then(async ()=> {
            // await t.commit()
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId, name, isPremiumUser) }) 
        }).catch(async (error ) => {
            // await t.rollback()
            throw new Error(error)
        })   
                
    } catch (err) {
        // await t.rollback()

        console.log('Error in updateTransactionStatus', err)
        res.status(500).json({message: 'Internal Server Error 500', err: err})
    }
}

//Not working yet
const updateTransactionStatusFailed = async (req, res, next) => {

    // const t = await sequelize.transaction()

    try{
        const userId = req.user._id
        const name = req.user.name

        console.log('transaction failed>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

        const { order_id } = req.body
        // const order  = await Order.findOne({where : {orderid : order_id}}) 



        /* const promise1 =  order.update({ paymentid: 'FAILED', status: 'FAILED'}, { transaction: t }) 
        const promise2 =  req.user.update({ isPremiumUser: false }, { transaction: t })  */

        const promise1 = Order.updateOne({orderid: order_id}, {paymentid: 'FAILED', status: 'FAILED'})
        // const promise2 = User.updateOne()

        Promise.all([promise1]).then(async ()=> {
            // await t.commit()
            return res.status(403).json({result: false, message: "Transaction Failed machi", token: userController.generateAccessToken(userId, name) })
        }).catch(async (error ) => {
            // await t.rollback()   
            throw new Error(error)
        }) 

    } catch(err){
        // await t.rollback()
        console.log('Error in updateTransactionStatusFailed', err)
        res.status(500).json({ error: err, message: 'Something went wrong'})
    }
}

module.exports = {
    purchasePremium,
    updateTransactionStatus,
    updateTransactionStatusFailed
}