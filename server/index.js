const express = require('express')
const session = require('express-session')
const app = express()
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')

const http = require('http')
const httpServer = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(httpServer, {
    cors: { origin: "*" }
})

const port = 1234;

const { Message, User, uploadMessage, mongoose, userLogin, userRegister } = require('./database')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: "secrete-key",
    resave: false,
    saveUninitialized: false,
}))

app.get('/', function (req, response) {
    response.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.get('/room', function (req, res) {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'public', 'ChatRoom.html'))
    } else {
        return res.status(401).send('Unauthorized. Please log in first.');
    }
})

app.get('/username', function (req, res) {
    console.log(`UserName = ${req.session.username}, fechted by ${req.sessionID}`)
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).send('Unauthorized');
    }
})

app.post('/login', async (req, res) => {
    const { name, password } = req.body
    console.log(`Login: ${name} with ${password}`)
    const longinResult = await userLogin(name, password)
    if (!longinResult) {
        //direct to ChatRoom.html
        console.log(`${name} is logged in at ${req.sessionID}.`)
        req.session.username = name
        res.redirect('/room')
    } else {
        res.redirect(`/?log=${longinResult}`)
    }

})

app.post('/register', async (req, res) => {
    const { name, password } = req.body
    console.log(`Register: ${name} with ${password}`)
    const registerResult = await userRegister(name, password)
    res.redirect(`/?log=${registerResult}`)
})

app.post('/logout', async (req, res) => {
    console.log(`logout requested by ${req.session.username}`)
    req.session.username = null
    const log = "You have been logged out :)"
    res.redirect('/')
})

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

