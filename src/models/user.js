const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    name:
        {
            type: String,
            required: true,
            trim: true,
        },
    age:
        {
            type: Number,
            string: '0',
            validate(value){
                if(value < 0){
                    throw new Error("Age must be a positive number")
                }
            }
        },
    email:
        {
            type: String,
            unique: true,
            lowercase: true,
            validate(str){
                if(!validator.isEmail(str)){
                    throw new Error("Email is invalid")
                }
            }
        },
    password:
        {
            type: String,
            required: true,
            trim: true,
            validate(str){
                if(str.value < 7){
                    throw new Error("Minimal count password must be 7 or more")
                }
                if(str === 'password'){
                    throw new Error("Password should not contain the word 'password'")
                }
            }
        },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//Хешування паролю
UserSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

//Перевірка на правильність авторизації
UserSchema.statics.findOneByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Incorrect email')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Incorrect password')
    }

    return user
}

//Метод для генерування токену
UserSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'kdweueksdsjfij')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//Віртуальне поле
UserSchema.virtual('tasks', {
    ref: "Task",
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.set('toObject', { virtuals: true })
UserSchema.set('toJSON', { virtuals: true })

//Метод, який забороняє відправку захищених даних(пароль, масив токенів)
UserSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

const User = mongoose.model('User', UserSchema)

module.exports = User


