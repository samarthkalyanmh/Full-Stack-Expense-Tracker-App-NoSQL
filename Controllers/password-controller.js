const sequelize = require('../util/database')
const uuid = require('uuid')
const ForgotPassword = require('../Models/forgot-password-model')
const User = require('../Models/user-model')
const bcrypt = require('bcrypt')

require('dotenv').config()


function generateUUID() {
    return uuid.v1()
}

// console.log(generateUUID())

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

        sendSmtpEmail.htmlContent = `<form onsubmit="submitPass(event)" ><a href="http://localhost:5/password/resetpassword/${uuidx}">Reset Password</a></form>`

        // console.log(sendSmtpEmail.htmlContent)

        //Send the email
        const apiInstance = new Sib.TransactionalEmailsApi()

        await apiInstance.sendTransacEmail(sendSmtpEmail)

        //Code to create a forgot password row in database
        const userRequesting = await User.findAll({where: {email: email}}) 
        await ForgotPassword.create({uuid: uuidx, UserId: userRequesting[0].id, isactive: true})

        res.status(200).json({ message: "Email sent successfully.", uuid: uuidx })

    } catch(err){
        console.log(err)
        res.status(500).json({ error: err, message: false })
    }
}


const sendResetPasswordForm = async (req, res, next) => {
    try{
        const uuid = req.params.uuid
        const row = await ForgotPassword.findAll({where: {uuid: uuid}})
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
        res.status(500).json({message: "Link not working"})
    }
}

//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????
//Unable to do this below using transaction. WHY???????????

const updatePassword = async (req, res, next) => {

    // const t = await sequelize.transaction()

try{   
        const uuid = req.params.uuid
        const row = await ForgotPassword.findAll({where: {uuid: uuid}})
        const newPassword = req.query.newpassword

        

        if(row){
            const UserId = row[0].UserId
            await ForgotPassword.update({isactive: false}, {where: {uuid: uuid}})

            bcrypt.hash(newPassword, 10, async (err, hash) => {
                if(err){
                    console.log(err)
                    throw new Error(err)
                } else{
                    await User.update({password: hash}, {where: {id: UserId}})
                }
                 
            })

            // await User.update({password: newPassword}, {where: {id: UserId}, transaction: t}) 
            // await t.commit()    
        }
    } catch(err){
        // await t.rollback()
        console.log(err)
    }

}

module.exports ={
    forgotPassword,
    sendResetPasswordForm,
    updatePassword
}