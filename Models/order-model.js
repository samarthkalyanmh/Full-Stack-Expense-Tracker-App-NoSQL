const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Order = sequelize.define('order', {
    id:{                                           
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    paymentid: Sequelize.STRING,    //Generated after payment is successful
    orderid: Sequelize.STRING,      //Generated when order gets created
    status: Sequelize.STRING        //status of transaction
})

module.exports = Order