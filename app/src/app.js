const client = require('./services/wppService');
const controller = require('./controllers/contactController')
const keywordController = require('./controllers/keywordController')
const helpers = require('./helpers/formatContact')
const nameHelpers = require('./helpers/formatName')
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
            const media = MessageMedia.fromFilePath('./public/stickers/hi.png');
            await client.sendMessage(msg.from, media, {sendMediaAsSticker: true})
            const resp = await messageController.getMessageByState(contact.data.state)
            if(resp.data.type === 'button'){
                await wppController.sendButton(msg, resp.data)
            }
        } else {
            if(msg.type === 'chat') {
                if(usersChangingName.indexOf(msg.from) > -1){
                    const name = nameHelpers.formartName(msg.body)
                    await client.sendMessage(msg.from, `Tudo bem, te chamarei de ${name}`)
                    usersChangingName.splice(usersChangingName.indexOf(msg.from), 1);
                    // muda name na database
                    await controller.updateContactName(msg.from, name)
                    await controller.updateContactState(msg.from, 1)
                    const initLeveling = await messageController.getMessageByState(1)
                    if(initLeveling.data.type === 'button'){
                        await wppController.sendButton(msg, initLeveling.data)
                    }
                    // muda state para +1 
                    // envia começar nivelamento
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
                    await client.sendMessage(msg.from, 'Desculpe, você já respondeu a esta mensagem.')
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
                        if(initLeveling.data.body.includes('!url')){
                            let body = initLeveling.data.body;
                            body = body.replace('!url', helpers.getUrl(contact.data.answer[4]))
                        }
                        await client.sendMessage(msg.from, body)
                    }, initLeveling.data.delay )
                    
                }

            }
            else if(resp.data.state < contact.data.state){
                await client.sendMessage(msg.from,'Você já respondeu a esta mensagem.')
            }
        } else if(msg.type === 'list_response') {
            if(contact.data.state>4) return client.sendMessage(msg.from, 'Você já respondeu a esta mensagem')
            let chat = await msg.getChat()
            let level = 0
            await controller.updateResp(msg.from, msg.body)
            await controller.updateContactState(msg.from, contact.data.state + 1)
            await client.sendMessage(msg.from, `Obrigado pelas respostas\n\nPor favor aguarde um instante que uma artesã irá finalizar seu atendimento.\n\nAté a próxima`)
                const media = MessageMedia.fromFilePath('./public/stickers/hi.png');
                await client.sendMessage(msg.from, media, {sendMediaAsSticker: true})
                setTimeout(async()=>{
                    const suporte = ['Suelem H.', 'Leticia P.','Amanda M.','Marcela A.','Patricia P.','Maria A.','Lorena A.']
                    var rn = Math.floor(Math.random()*suporte.length)
                    await client.sendMessage(msg.from, `*${suporte[rn]} entrou na conversa.*`)
                    setTimeout(async()=>{await chat.sendStateTyping()},2000)
                }, 10000)
                setTimeout(async()=>{
                    
                    const formatChoose = (data) => {
                        switch(data) {
                            case 'Vai ser meu primeiro Amigurumi':
                                return 'vai ser seu primeiro amigurumi então irei separar algumas vídeo aulas para você seguir e fazer seu primeiro amigurumi.'
                                break;
                            case 'Já faço e vendo, quero mais modelos':
                                level += 1
                                return 'já faz amigurumis para vender então irei separar 3 receitas para você escolher uma e faturar bastante rsrs'
                                break;
                            case 'Já fiz alguns mais simples':
                                level += 1
                                return 'ja fez alguns simples então irei separar 3 receitas de nível médio para você, você vai amar!'
                                break;
                        }
                    }
                    await client.sendMessage(msg.from, `Oiie ${contact.data.name}, tudo bem com você?\n\nVi aqui que você respondeu que ${formatChoose(contact.data.answer[2])}`)
                    setTimeout(async()=>{await chat.sendStateTyping()},2000)
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

                    }
                    setTimeout(async()=>{await chat.sendStateTyping()},2000)
                },30000)
                
                // muda status para 4
        }
    }
});