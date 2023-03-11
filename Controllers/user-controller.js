const User = require('../Models/user-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config

const generateAccessToken = (id, name, isPremiumUser) => {
    return jwt.sign({userId: id, name: name, isPremiumUser}, process.env.SECRET_KEY)
}

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

            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(password, salt)


            await User.create({ name, email, password: hashedPass}) 
            res.status(201).json({message: 'Successfully created new user'})

            //can use this below code too, but can't use transaction here
            // bcrypt.hash(password, 10, async (err, hash) => {
            //     await User.create({ name, email, password: hash}) 
            //     res.status(201).json({message: 'Successfully created new user'})
            // })
        }

    } catch(err){
        res.status(500).json(err)
    }
}

const login = async(req, res, next) => {
    try{ 
        const {email, password} = req.body

        console.log('entering login function')
        if(!email || !password){
            return res.status(400).json("bad parameters")
        }

        const userTryingToLogin = await User.findAll({where: {email: email}})

        if(userTryingToLogin.length === 0){
           return res.status(404).json("user doesn't exist")

        } else{

            bcrypt.compare(password, userTryingToLogin[0].password, (err, result) => {
                if(err){
                    throw new Error({message: "Something went wrong"})
                }
                if(result){
                    return res.status(200).json({message: "login successful", token: generateAccessToken(userTryingToLogin[0].id, userTryingToLogin[0].name, userTryingToLogin[0].isPremiumUser), isPremiumUser: userTryingToLogin[0].isPremiumUser})
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
    login,
    generateAccessToken
}