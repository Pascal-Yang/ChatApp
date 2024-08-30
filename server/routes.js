const express = require('express')
const path = require('path')
const router = express.Router()
const { userLogin, userRegister } = require('./database')

// Welcome login page
router.get('/', function (req, response) {
    response.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Chatroom page
router.get('/room', function (req, res) {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'public', 'ChatRoom.html'))
    } else {
        return res.status(401).send('Unauthorized. Please log in first.');
    }
})

// Fetch current logged-in username
router.get('/username', function (req, res) {
    console.log(`UserName = ${req.session.username}, fechted by ${req.sessionID}`)
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).send('Unauthorized');
    }
})

// Handle user login
router.post('/login', async (req, res) => {
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

// Handle user register
router.post('/register', async (req, res) => {
    const { name, password } = req.body
    console.log(`Register: ${name} with ${password}`)
    const registerResult = await userRegister(name, password)
    res.redirect(`/?log=${registerResult}`)
})

// Handle user logout
router.post('/logout', async (req, res) => {
    console.log(`logout requested by ${req.session.username}`)
    req.session.username = null
    const log = "You have been logged out :)"
    res.redirect('/')
})

module.exports = router