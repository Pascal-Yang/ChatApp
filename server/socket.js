
const { Message, uploadMessage } = require('./database')

function initializeSocket(io) {

    // Socket.io connection
    io.on('connection', (socket) => {
        console.log(`Connection established with ${socket.id}`);

        // Find all chat history and populate
        Message.find().sort({ time: 1 }).then((messages) => {
            messages.forEach(message => {
                io.emit('message', {
                    text: message.text,
                    username: message.name,
                    time: message.time,
                });
            })
        })

        // Handle new message sending
        socket.on('message', message => {
            console.log(message)

            const { username, text, time } = message
            uploadMessage(username, text, time)

            io.emit('message', message)
        });
    });

}

module.exports = initializeSocket