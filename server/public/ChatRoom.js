const socket = io('http://45.77.213.233:1234');

var userName = 'Default User'

console.log("Chat room js loaded")

const messageForm = document.querySelector('.form-message')
const messageInput = document.querySelector('.input-message')
const chatHistory = document.getElementById('chat_history')
const logoutButton = document.getElementById('logout')

window.onload = getUserName

function getUserName() {
    const response = fetch('/username').then(res => {
        return res.json()
    }
    ).then(data => {
        console.log(data)
        userName = data.username
    }).catch(err => {
        console.error('Error in fecthing username:', err)
    })
}

function formatTime(time) {
    const date = new Date(time)
    const format = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const formatedDate = new Intl.DateTimeFormat('en-US', format).format(date)
    return formatedDate.replaceAll('/', '.').replaceAll(',', '')
}

function creatNewMessage(name, text, time) {
    const newMessage = document.createElement('li')
    newMessage.className = 'message'

    // header with username and time
    const headerDiv = document.createElement('div')
    headerDiv.className = 'div-message-header'

    const nameSpan = document.createElement('span')
    nameSpan.className = 'span-name'
    nameSpan.textContent = name == userName ? 'Me' : name
    headerDiv.appendChild(nameSpan)

    const timeSpan = document.createElement('span')
    timeSpan.className = 'span-time'
    timeSpan.textContent = formatTime(time)
    headerDiv.appendChild(timeSpan)

    // textDiv
    const textDiv = document.createElement('div')
    textDiv.className = 'div-text'
    textDiv.textContent = text

    newMessage.appendChild(headerDiv)
    newMessage.appendChild(textDiv)
    return newMessage
}

function scrollToButtom() {
    chatHistory.scrollTop = chatHistory.scrollHeight
}

function addNewMessage(name, text, time) {
    chatHistory.appendChild(creatNewMessage(name, text, time))
    scrollToButtom()
}


// sending message through socket.io
messageForm.addEventListener('submit', (e) => {
    console.log(`message submit: ${messageInput.value}`)
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('message', {
            "text": messageInput.value,
            "username": userName,
            "time": new Date().toLocaleString()
        });
        messageInput.value = ''
    }
});

logoutButton.addEventListener('click', (e) => {
    console.log(`logout`)
    fetch('/logout', {
        method: 'POST'
    })
        .then(res => {
            if (res.ok) {
                console.log("logout successful")
                window.location.href = "/"
            } else {
                console.log("cannot logout")
            }
        })
        .catch(err => { console.error('Logout Error:', err); })
})

// recieving message from io
socket.on("message", (message) => {
    const { username, text, time } = message
    console.log(`${username}  ${text}  ${time}`)
    addNewMessage(username, text, time)
});