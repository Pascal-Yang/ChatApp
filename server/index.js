const express = require('express')
const session = require('express-session')
const app = express()
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')

const http = require('http')
const httpServer = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(httpServer, {
    cors: { origin: "*" }
})
const initializeSocket = require('./socket')

const port = 1234;

// Use express session to record current user.
app.use(session({
    secret: "secrete-key",
    resave: false,
    saveUninitialized: false,
}))

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }))

// Use routing from route.js
app.use('/', routes)

//set up socket io
initializeSocket(io)

httpServer.listen(port, () => {
    console.log(`http server is listening to port ${port}`)
});

