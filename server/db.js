const mongo = require('mongodb')
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/test"

main().catch(err => console.log(err))

async function main() {
    await mongoose.connect(url)

    const messageSchema = new mongoose.Schema({
        name: String,
        text: String,
        time: Date
    })

    const Message = mongoose.model('Message', messageSchema)

    const helloMessage = new Message({
        name: "Admin",
        text: "Welcome to the room.",
        time: new Date().toLocaleString(),
    })

    await helloMessage.save()

    const allmessages = await Message.find();

}