import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const port = 1234;

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