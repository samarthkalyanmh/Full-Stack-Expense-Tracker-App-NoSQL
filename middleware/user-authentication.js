const jwt = require('jsonwebtoken')
const User = require('../Models/user-model')

const authenticate = (req, res, next) => {
    
    try{
        const token = req.header('authorization')
        const user = jwt.verify(token, 'secretkey')

        User.findByPk(user.userId)
        .then(user => {
            req.user = user
            next()
        })
    } catch(err){
        console.log('error in user auth >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err)
        res.status(401).json({ result: false, message: err})
    }
}

module.exports = {
    authenticate
}