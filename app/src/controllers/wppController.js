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
    if (data.state === 0) {
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
    let list = new List(data.body, data.sections[0].title, data.sections, data.title, data.footer);
    setTimeout(async () => { await client.sendMessage(msg.from, list) }, data.delay)
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
    await client.sendMessage(msg.from, media, { sendMediaAsSticker: true })
}

exports.notifyAdmins = async (msg) => {
    const admins = await adminController.getAdmins()
    for (let i = 0; i < admins.length; i++) { // run all admins array
        if (msg.from !== `${admins[i].data.number}@c.us`) {
            let adminChat = await client.getChatById(`${admins[i].data.number}@c.us`)
            setTimeout(async () => {
                const resp = await client.sendMessage(`${admins[i].data.number}@c.us`, `O número ${msg.from.split('@c.us')[0]} enviou a seguinte mensagem.`)// notify admins
                setTimeout(async () => {
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

exports.sendSequenceMessage = async (msg, user) => {
    const sanitize = (msg, user) => {
        let message = msg
        message = message.replace('!urlPv147', 'https://google.com.br')
        message = message.replace('!urlPv67', 'https://google.com.br')
        message = message.replace('!urlPv34', 'https://google.com.br')
        message = message.replace('!urlPv', 'https://google.com.br')
        message = message.replace('!urlAluno', 'https://google.com.br')
        message = message.replace('!urlAdv', 'https://google.com.br')
        message = message.replace('!urlAdv2', 'https://google.com.br')
        message = message.replace('!urlGaleria', 'https://google.com.br')
        message = message.replace('!fname', user.fname)
        message = message.replace('!numero', user.number)
        message = message.replace('!name', user.name)
        message = message.replace('!urldepoimentos', 'https://google.com.br')
        return message
    }
    const sanitizeMedia = async (msg) => {
        const url = 'https://www.clubeamigurumi.com/fotos/'
        let tmpMsg = msg
        if (tmpMsg.indexOf('image:') > -1) {
            tmpMsg = tmpMsg.split('image:')[1]
            tmpMsg = MessageMedia.fromFilePath(`./public/fotos/${tmpMsg}`)
        }
        return tmpMsg

    }
    let message = ''
    switch (msg.type) {
        case 'media':
            message = sanitize(msg.body, user)
            message = await sanitizeMedia(message)
            await client.sendMessage(user.number, message)
            break;
        case 'button':
            console.log('Entrou botão')
            console.log('Mensagem: \n', msg.body)
            let body = sanitize(msg.body, user)
            body = await sanitizeMedia(body)
            const title = sanitize(msg.title, user)
            console.log('titulo :', msg.title)
            console.log('footer :', msg.footer)
            console.log('corpo editado :', body)
            let button = new Buttons(body, msg.buttons, title, msg.footer);
            await client.sendMessage(user.number, button)

            break;
        case 'text':
            message = sanitize(msg.body, user)
            message = await sanitizeMedia(message)
            await client.sendMessage(user.number, message)
            break;
    }


    // sanitize msg -> check media in body and constants in all texts

}






