const User = require('../Models/userLogin-model');
const bcrypt = require('bcrypt')

const signup = async (req, res, next) => {
    try{

        const {name, email, password} = req.body

        const userTryingToSignup = await User.findAll({where: {email: req.body.email}})

        if(userTryingToSignup.length > 0){
            return res.status(400).json({ message: "user exists already, click on login" })

            // return res.json({message: "user exists already, click on login" }) // for this line of code in the UI the message itself gets printed not the status code
        }

        if(!name || !email || !password){
            return res.status(400).json({message: "bad parameters, something is missing"})

        } else{

            bcrypt.hash(password, 10, async (err, hash) => {
                await User.create({ name, email, password: hash}) 
                res.status(201).json({message: 'Successfully created new user'})
            })
        }

    } catch(err){
        res.status(500).json(err)
    }
}

const login = async(req, res, next) => {
    try{ 

        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json("bad parameters")
        }
        console.log('email sent in request ', req.body.email)

        const userTryingToLogin = await User.findAll({where: {email: email}})
        console.log('User details ', userTryingToLogin)

        if(userTryingToLogin.length === 0){
           return res.status(404).json("user doesn't exist")

        } else{

            bcrypt.compare(password, userTryingToLogin[0].password, (err, result) => {
                if(err){
                    throw new Error({message: "Something went wrong"})
                }
                if(result){
                    return res.status(200).json({message: "login successful"})
                } else {
                    return res.status(400).json({message: "Incorrect password"})
                }
            })
        }
        
    } catch(err){
        console.log('err is ', err)
        res.status(500).json(err)
    }
}

module.exports = {
    signup,
    login
}