const jwt = require('jsonwebtoken')
const User = require('../Models/userLogin-model')

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
        return res.status(401).json({ result: false, message: err})
    }
}

module.exports = {
    authenticate
}