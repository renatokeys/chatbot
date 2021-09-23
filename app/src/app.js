const client = require('./services/wppService');
const controller = require('./controllers/contactController')
const keywordController = require('./controllers/keywordController')
const helpers = require('./utils/helpers')
const messageController = require('./controllers/messageController')
const wppController = require('./controllers/wppController')
const { MessageMedia } = require('whatsapp-web.js')

const usersChangingName = []

client.on('message', async msg => {
    const user = await helpers.formatContact(msg)
    let contact = await controller.checkContactExists(user);
    if(contact.data.state === 0) {  // novo contato
        const isKeyword = await keywordController.get_keyword_by_keyname(msg.body.toLowerCase());
        if(isKeyword){
            wppController.sendMediaSticker(client,msg,'./public/stickers/hi.png')
            const resp = await messageController.getMessageByState(contact.data.state)
            if(resp.data.type === 'button'){
                await wppController.sendButton(msg, resp.data)
            }
        } else {
            if(msg.type === 'chat') {
                if(usersChangingName.indexOf(msg.from) > -1){
                    const name = helpers.formartName(msg.body)
                    await client.sendMessage(msg.from, `Tudo bem, te chamarei de ${name}`)
                    usersChangingName.splice(usersChangingName.indexOf(msg.from), 1);
                    await controller.updateContactName(msg.from, name)
                    await controller.updateContactState(msg.from, 1)
                    const initLeveling = await messageController.getMessageByState(1)
                    if(initLeveling.data.type === 'button'){
                        await wppController.sendButton(msg, initLeveling.data)
                    }

                }
                console.log('nlp')
            } else if(msg.type === 'buttons_response') {
                const resp = await messageController.getMessageByResponse(msg.body)
                if(resp.data.state === contact.data.state){
                    if(msg.body === 'Não pode'){
                        await client.sendMessage(msg.from,'Sem problemas, como posso te chamar?')
                        usersChangingName.push(msg.from)
                    }
                    else {
                        await controller.updateContactState(msg.from, contact.data.state + 1)
                        const initLeveling = await messageController.getMessageByState(contact.data.state + 1)
                        if(initLeveling.data.type === 'button'){
                            await wppController.sendButton(msg, initLeveling.data)
                        }
                        // envia começar nivelamento
                    }
                    
                } else if(resp.data.state < contact.data.state) {
                    helpers.sendAlreadyResponse(msg, client)
                }
            }
        }
    }
    else { 
        if(msg.type === 'buttons_response') {
            const resp = await messageController.getMessageByResponse(msg.body)
            if(resp.data.state === contact.data.state){
                await controller.updateResp(msg.from, msg.body)
                await controller.updateContactState(msg.from, contact.data.state + 1)
                const initLeveling = await messageController.getMessageByState(contact.data.state + 1)
                if(initLeveling.data.type === 'button'){
                    await wppController.sendButton(msg, initLeveling.data)
                }
                else if(initLeveling.data.type === 'list'){
                    await wppController.sendList(msg, initLeveling.data)
                }
                else if(initLeveling.data.type === 'text'){
                    setTimeout(async() => {
                        let body = initLeveling.data.body;
                        let url = helpers.getUrl(msg.body, contact.data.answer[3].split('\n')[0])
                        await controller.updateContactRecipes(msg.from, url.id)
                        let number = msg.from
                        number = number.replace('@c.us', '')
                        body = body.replace('!url', `https://curso.artsdeamigurumi.online/aluno/${number}`)
                        body = body.replace('!receita', url.name.toLowerCase())
                        await client.sendMessage(msg.from, body)
                    }, initLeveling.data.delay )
                    
                }

            }
            else if(resp.data.state < contact.data.state){
                helpers.sendAlreadyResponse(msg, client)
            }
        } else if(msg.type === 'list_response') {
            if(contact.data.state>4) return helpers.sendAlreadyResponse(msg, client)
            let level = 0
            let choose = ''
            choose, level = helpers.formatChoose(contact.data.answer[2], level)
            await controller.updateResp(msg.from, msg.body)
            await controller.updateContactState(msg.from, contact.data.state + 1)
            await client.sendMessage(msg.from, `Obrigado pelas respostas\n\nPor favor aguarde um instante que uma artesã irá finalizar seu atendimento.\n\nAté a próxima`)
                wppController.sendMediaSticker(client, msg, './public/stickers/hi.png')
                setTimeout(async()=>{
                    await client.sendMessage(msg.from, `*${helpers.getSupportName()} entrou na conversa.*`)
                    setTimeout(async()=>{await wppController.simulateTyping(msg)},2000)
                }, 10000)
                setTimeout(async()=>{
                    await client.sendMessage(msg.from, `Oiie ${contact.data.name}, tudo bem com você?\n\nVi aqui que você respondeu que ${choose}`)
                    setTimeout(async()=>{await wppController.simulateTyping(msg)},2000)
                }, 20000)
                setTimeout(async()=>{
                    if(level > 0){
                        const data = {
                            type: 'button',
                            title: 'Prontinho escolha uma receita',
                            body: MessageMedia.fromFilePath(`./public/recipes/${msg.body.split('\n')[0].toLowerCase()}.png`),
                            footer: '\nSelecione uma receita clicando abaixo 👇',
                            buttons: [{body:'Receita 1'},{body:'Receita 2'},{body:'Receita 3'}],
                            delay: 1000

                        }
                        await wppController.sendMediaButton(msg, data)
                        
                    }
                    else {
                        await controller.updateContactRecipes(msg.from, 'abelhinha')
                        await client.sendMessage(msg.from,`Prontinho, separei uma super aula de iniciante para você se aventurar nesse lindo mundo dos amigurumis, clica no link abaixo para poder ver sua aula, beijos\n\nwww.curso.artsdeamigurumi.online/aluno/${msg.from.split('@c.us')[0]}`)
                    }
                    setTimeout(async()=>{await wppController.simulateTyping(msg)},2000)
                },30000)
                
                // muda status para 4
        }
    }
});