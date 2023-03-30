const User = require('../Models/user-model')
const Expense = require('../Models/expense-model')
const FileURL = require('../Models/previous-downloads-fileURL-model')

const S3Services = require('../Services/S3-services')
const UserServices = require('../Services/User-services')

const sequelize = require('../util/database')

require('dotenv').config()

const showLeaderBoard = async (req, res, next) => {
    try{  
        const sample = await User.find({}, {name: 1, totalExpense: 1}).sort({totalExpense: -1})
        res.status(200).json(sample)

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal Server Error 500', err: err})
    }
}

const downloadExpense = async (req, res, next) => {
    
    try{
        // const expenses = await req.user.getExpenses()
        const expenses = await UserServices.getExpenses(req)

        const UserId = req.user.id

        const user = await User.findOne({where: {id: UserId}})

        if(user.isPremiumUser){
            const stringifiedExpenses = JSON.stringify(expenses)
            const fileName = `expensesof${UserId}/${new Date()}.txt`
            const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName)
            console.log('fileURL>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', fileURL)

            await FileURL.create({ fileURL, fileName, UserId}) 
     
            res.status(200).json({fileURL, message: 'response from backend' })
        
        } else{
            res.status(401).json({message: 'Unauthorized, not a premium user'})
        }
        
    } catch(err){ 
        console.log(err)
        res.status(500).json({message: 'Internal Server Error 500', err: err})
    }
}

const getOldDownloadData = async (req, res, next) => {
    try{
            const oldDownloadURLs = await FileURL.findAll({where: {UserId: req.user.id}})
            
            if(req.user.isPremiumUser){
                res.status(200).json(oldDownloadURLs)
            } else{
                res.status(404).json({message: 'Not a premium user'})
            }
            

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal Server Error 500', err: err})
    }
}

module.exports = {
    showLeaderBoard,
    downloadExpense,
    getOldDownloadData
}