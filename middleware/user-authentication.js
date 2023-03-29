const jwt = require('jsonwebtoken')
const User = require('../Models/user-model')
require('dotenv').config()

const authenticate = async (req, res, next) => {
    
    try{
        const token = req.header('authorization')
        const user = jwt.verify(token, process.env.SECRET_KEY)

        console.log(user)

        console.log('token in backend>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', token) 

        // await User.findByPk(user.userId)
        // .then(user => {
        //     req.user = user
        //     next()
        // })
        const userinDb = await User.find({_id: user.userId})

        console.log('user in DB is<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', userinDb)

        req.user = userinDb

        console.log('req.user is>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.user)
        next()
        
    } catch(err){
        console.log('error in user auth >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err)
        res.status(401).json({ result: false, message: err})
    }
}

module.exports = {
    authenticate
}