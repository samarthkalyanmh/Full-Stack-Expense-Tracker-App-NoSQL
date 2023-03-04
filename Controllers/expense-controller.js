const Expense = require('../Models/expense-model')
const User = require('../Models/user-model')
const sequelize = require('../util/database')
const AWS = require('aws-sdk')
require('dotenv').config()

const getAllExpenses = async (req, res, next) => {

    try{
        // req.user.getExpenses() // You can also use this function provided by sequelize itself
        const allExpenses = await Expense.findAll({ where: {userId: req.user.id}})
        res.status(201).json(allExpenses)

    } catch(err){
        console.log(err)
        res.status(500).json(err)    
    }
}

const addExpense = async (req, res, next) => {

    //This below declaration should be outside the try block coz if we declare it inside try block, then we can't access it in catch block
    const t = await sequelize.transaction()

    try{
        const amount = req.body.amount
        const description = req.body.description
        const category = req.body.category
        const UserId = req.user.id

        if(amount === '' || !description || !category){
            throw new Error("Bad Parameters")
        }

        // Can use this magic function as well (Provided by sequelize)
        // const data = await req.user.createExpense({ amount, description, category, UserId}) 
        const data = await Expense.create({ amount, description, category, UserId}, {transaction: t})

        const currentTotalExpense = await User.findOne({ where: { id: UserId } })
        await req.user.update({totalExpense: currentTotalExpense.totalExpense + Number(amount)}, {transaction: t})

        await t.commit()
        res.status(201).json(data)
        
    } catch(err) {
        await t.rollback()
        console.log(err)
        res.status(500).json(err)
    }
}


//Should optimise below code
const deleteExpense = async (req, res, next) => {

    //This below declaration should be outside the try block coz if we declare it inside try block, then we can't access it in catch block
    const t = await sequelize.transaction()

    try{    
        const uid = req.params.id

        const amountOfDeletedExpense = await Expense.findOne({where: {id: uid, UserId: req.user.id}})

        await Expense.destroy({where: {id: uid, UserId: req.user.id}, transaction: t})


        const val = await User.findOne({ where: { id: req.user.id }})

        await req.user.update({totalExpense: val.totalExpense - Number(amountOfDeletedExpense.amount)}, {
            transaction: t
        })

        await t.commit()
        res.sendStatus(200)

    } catch(err){
        console.log(err)
        t.rollback()
        res.status(500).json(err)
    }   
}

const downloadExpense = async (req, res, next) => {
    
    try{
        const expenses = await req.user.getExpenses()
        console.log(expenses)

        const stringifiedExpenses = JSON.stringify(expenses)
        const fileName = 'expenses.txt'
        const fileURL = uploadToS3(stringifiedExpenses, fileName)

        res.status(200).json({message: 'downloadExpense api backend response', fileURL: fileURL})

    } catch(err){
        console.log(err)
    }
}

function uploadToS3(data, fileName){
    const BUCKET_NAME = process.env.BUCKET_NAME
    const IAM_USER_ACCESS_KEY = process.env.IAM_USER_ACCESS_KEY
    const IAM_USER_SECRET_KEY = process.env.IAM_USER_SECRET_KEY

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_ACCESS_KEY,
        secretAccessKey: IAM_USER_SECRET_KEY
    })

    s3bucket.createBucket(() => {
        var params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: data,
        }
        s3bucket.upload(params, (err, s3response) => {
            if(err){
                console.log('Something went wrong', err)
            } else{
                console.log('success', s3response)
            }
        })
    })
    
}

module.exports = {
    getAllExpenses,
    addExpense,
    deleteExpense,
    downloadExpense
}