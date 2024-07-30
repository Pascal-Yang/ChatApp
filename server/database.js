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

userSchema.pre('save', function (next) {
    const user = this
    const salt = bcrypt.genSalt(10)
    user.password = bcrypt.hash(user.password, salt)
    next()
})

userSchema.methods.verifyPassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model('user', userSchema)

// 0: succssed, 1: no user, 2: incorrect passowrd
function userLogin(name, password) {
    const user = User.findOne({ name: name })
    if (user) {
        if (user.verifyPassword(password)) {
            return 0
        } else {
            return 2
        }
    } else {
        return 1
    }

}

module.exports = { Message, uploadMessage, User, mongoose, userLogin }