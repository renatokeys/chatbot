const client = require('./services/wppService');
const controller = require('./controllers/contactController')
const helpers = require('./utils/helpers')
const messageController = require('./controllers/messageController')
const levelingController = require('./controllers/levelingController')

client.on('message', async msg => {
    const user = await helpers.formatContact(msg)
    let contact = await controller.checkContactExists(user);
    if(contact.data.state === 0) { // Novo contato
        await levelingController.newLevelingContact(msg, contact)
    }
    else { // Contato existente
        if(msg.type === 'buttons_response') {
            const resp = await messageController.getMessageByResponse(msg.body)
            if(resp.data.state === contact.data.state){
                await levelingController.sendNextQuestion(msg, contact)
            }
            else if(resp.data.state < contact.data.state){
                await helpers.sendAlreadyResponse(msg, client)
            }
        } else if(msg.type === 'list_response') {
            if(contact.data.state > 4) return helpers.sendAlreadyResponse(msg, client)
            await levelingController.simulateAssistant(msg, contact)
        } else if(msg.type === 'chat') {
            console.log('nlp')
        }
    }
});