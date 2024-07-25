const socket = io('ws://localhost:1234');

document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const input = document.querySelector('input');
    if (input.value) {
        socket.emit('message', input.value);
        input.value = ''
    }
});

socket.on("message", (message)=>{
    console.log(message)
    let newMessage = document.createElement('li')
    newMessage.textContent = message
    document.querySelector('ul').appendChild(newMessage)
});