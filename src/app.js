const mongoose = require('mongoose');
const express = require('express');
const connDB = require('./connDB/DB');

const { PORT } = require('./config/index');

const User = require('./models/user');
const Task = require('./models/task');

const usersRouter = require('./routers/user');
const tasksRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

connDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
}).catch((err) => {
    console.log(err.message);
})
