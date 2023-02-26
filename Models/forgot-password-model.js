const Sequelize = require ('sequelize')
const sequelize  = require('../util/database')

const ForgotPasswordRequests = sequelize.define('forgot_password_requests', {
  uuid : { 
    type : Sequelize.STRING, 
    // autoIncrement : true,
    allowNull : false,
    primaryKey : true,
  },
  UserId : { 
    type : Sequelize.INTEGER, 
    allowNull : false,
  },
  isactive : { 
    type : Sequelize.BOOLEAN,
    allowNull : false 
  }
})


module.exports = ForgotPasswordRequests
