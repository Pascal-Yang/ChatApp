const express = require('express')
app = express()

const http = require('http')
const httpServer = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(httpServer, {
    cors: {origin:"*"}
})

const port = 1234;

app.use(express.static(__dirname+'/public'))

io.on('connection', (socket) =>{
    console.log(`Connection established with ${socket.id}`);
    socket.on('message', message=>{
        console.log(message)
        io.emit('message', message)
    });
});

httpServer.listen(port, ()=>{
    console.log(`http server is listening to port ${port}`)
});