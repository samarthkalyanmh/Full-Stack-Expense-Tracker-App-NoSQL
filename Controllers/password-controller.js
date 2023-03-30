const uuid = require('uuid')
const ForgotPassword = require('../Models/forgot-password-model')
const User = require('../Models/user-model')
const bcrypt = require('bcrypt')

require('dotenv').config()

function generateUUID() {
    return uuid.v1()
}

const forgotPassword = async (req, res, next) => {
    try{
        const email = req.body.email
        // const uuidx = req.middlewareUUID
        const uuidx = generateUUID()

        // console.log(uuidx, "is the last step")

        const Sib = require('sib-api-v3-sdk')

        const client = Sib.ApiClient.instance

        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY

        // create a transactional email message
        let sendSmtpEmail = new Sib.SendSmtpEmail()
        sendSmtpEmail.to = [{ "email": email }]
        sendSmtpEmail.sender = { "email": "samarthkalyanmh777@gmail.com", "name": "Samarth" }
        sendSmtpEmail.subject = "Reset-Password"
        sendSmtpEmail.textContent = "Hey Click below to reset Your Password"

        sendSmtpEmail.htmlContent = `<form onsubmit="submitPass(event)" ><a href="http://localhost:3000/password/resetpassword/${uuidx}">Reset Password</a></form>`

        // console.log(sendSmtpEmail.htmlContent)

        //Send the email
        const apiInstance = new Sib.TransactionalEmailsApi()

        await apiInstance.sendTransacEmail(sendSmtpEmail)

        //Code to create a forgot password row in database
        const userRequesting = await User.findOne({email: email}) 

        await ForgotPassword.create({uuid: uuidx, UserId: userRequesting._id, isactive: true})

        res.status(200).json({ message: "Email sent successfully.", uuid: uuidx})

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal Server Error 500', err: err})
    }
}


const sendResetPasswordForm = async (req, res, next) => {
    try{
        const uuid = req.params.uuid
        const row = await ForgotPassword.find({uuid: uuid})
        if(row && row[0].isactive){
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${uuid}" method="GET">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`)
        }

    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal Server Error 500, Link not working', err: err})
    }
}


const updatePassword = async (req, res, next) => {

    // const t = await sequelize.transaction()

try{   
        const uuid = req.params.uuid
        const row = await ForgotPassword.find({uuid: uuid})
        const newPassword = req.query.newpassword

        if(row){
            const UserId = row[0].UserId
            await ForgotPassword.updateOne({uuid: uuid}, {$set: {isactive: false}})

            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(newPassword, salt)

            await User.updateOne({_id: UserId}, {$set: {password: hashedPass}})

            res.redirect('/Login/login.html')

            // await t.commit()    
        }
    } catch(err){       
        // await t.rollback()
        console.log(err)
        res.status(500).json({message: 'Internal Server Error 500', err: err})
    }

}

module.exports ={
    forgotPassword,
    sendResetPasswordForm,
    updatePassword
}