const express = require('express')
app = express()

const http = require('http')
const httpServer = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(httpServer, {
    cors: { origin: "*" }
})

const port = 1234;

const mongoose = require('mongoose')
const dburl = "mongodb://localhost:27017/test"
mongoose.connect(dburl)

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

app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
    console.log(`Connection established with ${socket.id}`);

    Message.find().sort({ time: 1 }).then((messages) => {
        messages.forEach(message => {
            io.emit('message', {
                text: message.text,
                username: message.name,
                time: message.time,
            });
        })
    })

    socket.on('message', message => {
        console.log(message)

        const { username, text, time } = message
        uploadMessage(username, text, time)

        io.emit('message', message)
    });
});

httpServer.listen(port, () => {
    console.log(`http server is listening to port ${port}`)
});

function createMessage(userName, text) {
    return {
        userName,
        text,
        time: new Date().toLocaleString()
    }
}