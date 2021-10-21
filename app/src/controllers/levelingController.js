'use strict';
const wppController = require('../controllers/wppController')
const usersChangingName = []
const client = require('../services/wppService');
const helpers = require('../utils/helpers')
const controller = require('../controllers/contactController')
const messageController = require('../controllers/messageController')
const keywordController = require('../controllers/keywordController')
const sequenceController = require('../controllers/sequenceController')

const { MessageMedia } = require('whatsapp-web.js')

const sendChooseRecipe = exports.sendChooseRecipe = async (msg) => {
    const data = {
        type: 'button',
        title: 'Prontinho escolha uma receita',
        body: MessageMedia.fromFilePath(`./public/recipes/${msg.body.split('\n')[0].toLowerCase()}.png`),
        footer: '\nSelecione uma receita clicando abaixo 👇',
        buttons: [{ body: 'Receita 1' }, { body: 'Receita 2' }, { body: 'Receita 3' }],
        delay: 1000

    }
    await wppController.sendMediaButton(msg, data)
}

const checkChangeName = exports.checkChangeName = async (msg) => {
    if (usersChangingName.indexOf(msg.from) > -1) {
        const name = helpers.formartName(msg.body)
        await client.sendMessage(msg.from, `Tudo bem, te chamarei de ${name}`)
        usersChangingName.splice(usersChangingName.indexOf(msg.from), 1);
        await controller.updateContactName(msg.from, name)
        await controller.updateContactState(msg.from, 1)
        const initLeveling = await messageController.getMessageByState(1)
        if (initLeveling.data.type === 'button') {
            await wppController.sendButton(msg, initLeveling.data)
        }
        return true
    }
    return false
}

const setChangeName = exports.setChangeName = async (msg) => {
    usersChangingName.push(msg.from)
}

exports.sendNextQuestion = async (msg, contact) => {
    await controller.updateResp(msg.from, msg.body)
    await controller.updateContactState(msg.from, contact.data.state + 1)
    const initLeveling = await messageController.getMessageByState(contact.data.state + 1)
    if (initLeveling.data.type === 'button') {
        await wppController.sendButton(msg, initLeveling.data)
    }
    else if (initLeveling.data.type === 'list') {
        await wppController.sendList(msg, initLeveling.data)
    }
    else if (initLeveling.data.type === 'text') {
        setTimeout(async () => {
            let body = initLeveling.data.body;
            let url = helpers.getUrl(msg.body, contact.data.answer[3].split('\n')[0])
            await controller.updateContactRecipes(msg.from, url.id)
            let number = msg.from
            number = number.replace('@c.us', '')
            body = body.replace('!url', `https://curso.artsdeamigurumi.online/aluno/${number}`)
            body = body.replace('!receita', url.name.toLowerCase())
            await client.sendMessage(msg.from, body)
        }, initLeveling.data.delay)
    }
}

exports.simulateAssistant = async (msg, contact) => {
    const choose = await helpers.formatChoose(contact.data.answer[2])
    await controller.updateResp(msg.from, msg.body)
    await controller.updateContactState(msg.from, contact.data.state + 1)
    await client.sendMessage(msg.from, `Obrigado pelas respostas\n\nPor favor aguarde um instante que uma artesã irá finalizar seu atendimento.\n\nAté a próxima`)
    await wppController.sendMediaSticker(msg, './public/stickers/hi.png')
    setTimeout(async () => {
        await client.sendMessage(msg.from, `*${helpers.getSupportName()} entrou na conversa.*`)
        setTimeout(async () => { await wppController.simulateTyping(msg) }, 2000)
    }, 10000)
    setTimeout(async () => {
        await client.sendMessage(msg.from, `Oiie ${contact.data.fname}, tudo bem com você?\nVi aqui que você respondeu que ${choose.choose}`)
        setTimeout(async () => { await wppController.simulateTyping(msg) }, 2000)
    }, 25000)
    setTimeout(async () => {
        setTimeout(async () => { await wppController.simulateTyping(msg) }, 2000)
        if (choose.level > 0) {
            sendChooseRecipe(msg) // send message choosen
        }
        else {
            await controller.updateContactRecipes(msg.from, 'abelhinha') // dup this to polvinho recipe.
            await client.sendMessage(msg.from, `Prontinho, separei uma super aula de iniciante para você se aventurar nesse lindo mundo dos amigurumis, clica no link abaixo para poder ver sua aula, beijos\n\nhttps://curso.artsdeamigurumi.online/aluno/${msg.from.split('@c.us')[0]}`)
        }
    }, 40000)
    let userSeq = ''
    if (level == 0) {
        userSeq = 'iniciante'
    } else {
        userSeq = 'avançado'
    }
    await sequenceController.addUserSequence({ number: msg.from, seq: userSeq })
}

exports.newLevelingContact = async (msg, contact) => {
    const isKeyword = await keywordController.get_keyword_by_keyname(msg.body.toLowerCase());
    if (isKeyword) {
        wppController.sendMediaSticker(msg, './public/stickers/hi.png')
        setTimeout(async () => {
            await messageController.getMessageByState(contact.data.state).catch(err => {
                console.log(err)
            }).then(async resp => {
                if (resp.data.type === 'button') {
                    await wppController.sendButton(msg, resp.data)
                }
            })
        }, 2000)
    } else {
        if (msg.type === 'chat') {
            const changeName = await checkChangeName(msg)
            if (!changeName) {
                console.log('nlp')
            }
        } else if (msg.type === 'buttons_response') {
            if (msg.body === 'Não pode') {
                await client.sendMessage(msg.from, 'Sem problemas, como posso te chamar?')
                await setChangeName(msg)
            }
            else {
                console.log(contact)
                await controller.updateContactState(msg.from, contact.data.state + 1).catch(err => console.log(err)).then(data => console.log(data))
                const initLeveling = await messageController.getMessageByState(contact.data.state + 1)
                if (initLeveling.data.type === 'button') {
                    await wppController.sendButton(msg, initLeveling.data)
                }
            }
        }
    }
}