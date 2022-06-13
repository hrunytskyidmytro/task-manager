const mongoose = require('mongoose')
const express = require('express')
const connDB = require('./connDB/DB')

const { PORT } = require('./config/index')

const User = require('./models/user')
const Task = require('./models/task')

const usersRouter = require('./routers/user')
const tasksRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(usersRouter)
app.use(tasksRouter)

connDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err.message)
})






// Пов'язано з сервером
/*
const http = require('http')
const url = require('url')

http.createServer((request, response) => {
    console.log("Server create")
    let urlRequest = url.parse(request.url, true)
    console.log(urlRequest)
    console.log(request.method)
    console.log(urlRequest.query.test)
    response.end("It's my first server!!!")
}).listen(port)
*/