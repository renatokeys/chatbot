
const messageController = require('../controllers/messageController')

let messages = []

const readListDay = async () => {
    const date = new Date()
    const msgData = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    messages = []
    await messageController.getMessagesFromDay(msgData, messages)

}



exports.messages = messages
exports.readListDay = readListDay