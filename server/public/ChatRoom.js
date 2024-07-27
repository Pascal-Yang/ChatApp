const socket = io('ws://localhost:1234');
const userName = 'Default User'

console.log("Chat room js loaded")

const messageForm = document.querySelector('.form-message')
const messageInput = document.querySelector('.input-message')
const chatHistory = document.getElementById('chat_history')

function creatNewMessage(name, text, time){
    let newMessage = document.createElement('li')
    newMessage.className = 'message'

    // header with username and time
    let headerDiv = document.createElement('div')
    headerDiv.className = 'div-message-header'

    let nameSpan = document.createElement('span')
    nameSpan.className = 'span-name'
    nameSpan.textContent = name
    headerDiv.appendChild(nameSpan)

    let timeSpan = document.createElement('span')
    timeSpan.className = 'span-time'
    timeSpan.textContent = time   
    headerDiv.appendChild(timeSpan)

    // textDiv
    let textDiv = document.createElement('div')
    textDiv.className = 'div-text'
    textDiv.textContent = text

    newMessage.appendChild(headerDiv)
    newMessage.appendChild(textDiv)
    return newMessage
}

function scrollToButtom(){
    chatHistory.scrollTop = chatHistory.scrollHeight
}

function addNewMessage(name, text, time){
    chatHistory.appendChild(creatNewMessage(name, text, time))
    scrollToButtom()
}


// sending message through socket.io
messageForm.addEventListener('submit', (e)=>{
    console.log(`message submit: ${messageInput.value}`)
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('message', {
            "text":messageInput.value,
            "username":userName,
            "time": new Date().toLocaleString()
        });
        messageInput.value = ''
    }
});

// recieving message from io
socket.on("message", (message)=>{
    const {username, text, time} = message
    console.log(`${username}  ${text}  ${time}`)
    addNewMessage(username, text, time)
});