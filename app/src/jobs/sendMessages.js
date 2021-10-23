const { messages } = require('./getMessages')
const sequenceController = require('../controllers/sequenceController')
const contactController = require('../controllers/contactController')
const wppController = require('../controllers/wppController')

const checkMessage = () => {
    messages.map(async (value) => {
        const now = new Date()
        const msgDate = new Date(value.date * 1000)
        if (now.getHours() == msgDate.getHours()) {
            if (now.getMinutes() == msgDate.getMinutes()) {
                const message = await sequenceController.getMessage(value.message).catch(console.error())
                if (message) {
                    const user = await contactController.getContactByNumber(value.number)
                    await wppController.sendSequenceMessage(message.data, user.data)
                }
            }
        }
    })
}


exports.checkMessage = checkMessage