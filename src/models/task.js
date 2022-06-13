const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const TaskSchema = mongoose.Schema({
    description:
        {
            type: String,
            required: true,
            trim: true
        },
    completed:
        {
            type: Boolean,
            required: false
        },
    owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task