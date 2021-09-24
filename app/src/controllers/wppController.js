const { List, Buttons, MessageMedia } = require('whatsapp-web.js');
const client = require('../services/wppService')
const helpers = require('../utils/helpers')
const adminController = require('./adminController')
const nlpController = require('./nlpController')

exports.sendButton = async (msg, data) => {
    let buttons = []
    data.buttons.map((button) => {
        buttons.push({
            body: button.text
        })
    })
    if(data.state === 0) {
        const contact = await msg.getContact()
        let contactName = contact.verifiedName ? contact.verifiedName : contact.pushname
        contactName = helpers.firstName(contactName)
        data.body = data.body.replace('!fname', contactName)
        data.title = data.title.replace('!fname', contactName)
    }
    let button = new Buttons(data.body, buttons, data.title, data.footer);
    setTimeout(async () => { await client.sendMessage(msg.from, button) }, data.delay)
}

exports.sendMediaButton = async (msg, data) => {
    let button = new Buttons(data.body, data.buttons, data.title, data.footer);
    setTimeout(async () => { await client.sendMessage(msg.from, button) }, data.delay)
}

exports.sendList = async (msg, data) => {
    let list = new List(data.body, data.sections[0].title , data.sections, data.title, data.footer);
    setTimeout(async () => { await client.sendMessage(msg.from, list)}, data.delay)
}

exports.simulateTyping = async (msg) => {
    try {
        const chat = await msg.getChat()
        await chat.sendStateTyping()
    } catch (err) {
        console.log(err)
    } finally {
        return true
    }
    

}

exports.sendMediaSticker = async (msg, path) => {
    const media = MessageMedia.fromFilePath(path);
    await client.sendMessage(msg.from, media, {sendMediaAsSticker: true})
}

exports.notifyAdmins = async (msg) => {
    const admins = await adminController.getAdmins()
    for(let i=0; i<admins.length; i++) { // run all admins array
        if (msg.from !== `${admins[i].data.number}@c.us`){
            let adminChat = await client.getChatById(`${admins[i].data.number}@c.us`)
            setTimeout(async () => {
                const resp = await client.sendMessage(`${admins[i].data.number}@c.us`,`O número ${msg.from.split('@c.us')[0]} enviou a seguinte mensagem.`)// notify admins
                setTimeout (async () => {
                    await msg.forward(adminChat)
                    await nlpController.addAnswerProcess(msg)
                }, 2000)
                //console.log(resp)
            }, 3000 * i)
        }
    }
}

exports.sendText = async (msg) => {
    await client.sendMessage(msg.from, msg.body)
}
