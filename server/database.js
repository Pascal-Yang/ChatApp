const mongo = require('mongodb')
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/test"

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

const User = mongoose.model('user', userSchema)

module.exports = { Message, uploadMessage, User }