const mongoose = require('mongoose')

const previousDownloads = new mongoose.Schema({
    fileURL : String,
    fileName: String,
    UserId : {
        type : mongoose.SchemaTypes.ObjectId, 
        ref:'users'
    }
})

module.exports = mongoose.model('previousdownloads', previousDownloads)

