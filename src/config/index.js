const connectToMongoDB = 'mongodb://localhost:27017/TaskManager'
const PORT = process.env.PORT || 3000
const url = `http://localhost:${PORT}`

module.exports = {
    connectToMongoDB, PORT, url
}