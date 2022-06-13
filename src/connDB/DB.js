const mongoose = require('mongoose')
const {connectToMongoDB} = require('../config/index')

const connDB = async() => {
    try {
        await mongoose.connect(connectToMongoDB)
    }
    catch (e) {
        throw new Error(e)
    }
}

module.exports = connDB