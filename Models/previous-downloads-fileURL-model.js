const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const previousDownloads = sequelize.define('PreviousDownloads', {
    fileURL:{
        type: Sequelize.STRING,
        allowNull: false
    },
    fileName: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports =  previousDownloads