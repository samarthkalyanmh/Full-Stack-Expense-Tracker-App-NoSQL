const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize('full_stack_expense_tracker_app', 'root', 'samarth', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize