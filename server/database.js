const mongo = require('mongodb')
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/test"
mongoose.connect(url)
const bcrypt = require('bcrypt')

const messageSchema = new mongoose.Schema({
    text: String,
    name: String,
    time: Date,
});

const Message = mongoose.model('Message', messageSchema);

async function uploadMessage(username, text, time) {
    try {
        const newMessage = await Message.create({
            name: username,
            text: text,
            time: time,
        })
        console.log(`New message from ${username} is added to the database.`)
    } catch (err) {
        console.log(err)
    }
}

userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (err) {
        next(err)
    }

})

userSchema.methods.verifyPassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model('user', userSchema)

// 0: succssed, 1: no user, 2: incorrect passowrd
function userLogin(name, password) {
    return User.findOne({ name: name }).then(user => {
        if (user) {
            return user.verifyPassword(password).then(verified => {
                if (verified) {
                    return null
                } else {
                    return "Incorrect Password :("
                }
            })
        } else {
            return "User Not Found :("
        }
    })
}

function userRegister(name, password) {
    return User.findOne({ name: name })
        .then(user => {
            if (user) {
                return "User Name Already Exist :("
            }
            return User.create({
                name: name,
                password: password
            })
                .then(() => { return `Welcom ${name}. You can now login :)` })
                .catch(err => { return "An error occurred during registration :(" })
        })
        .catch(err => { return "An error occurred during registration :(" })
}

module.exports = { Message, uploadMessage, User, mongoose, userLogin, userRegister }