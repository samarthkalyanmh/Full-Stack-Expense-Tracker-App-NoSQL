const sequelize = require("sequelize")
// const uuid = require('uuid')
require('dotenv').config()


// function generateUUID() {
//     return uuid.v1()
// }

// console.log(generateUUID())

const forgotPassword = async (req, res, next) => {

    console.log('ENTERING HERE')

    const email = req.body.email
    // const uuidx = req.middlewareUUID;
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

    // sendSmtpEmail.htmlContent = `<form  onsubmit="submitPass(event)" ><a href="http://localhost:4000/password/resetpassword/${uuidx}">Reset Password</a></form>`

    // console.log(sendSmtpEmail.htmlContent)

    // send the email
    const apiInstance = new Sib.TransactionalEmailsApi()

    apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(
            res.status(200).json({ message: "Email sent successfully."/* , uuid :uuidx  */})
        )
        .catch((err) => {
            res.status(500).json({ error: err, message: false })
        });
}

module.exports ={
    forgotPassword
}