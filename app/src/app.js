const client = require('./services/wppService');
const controller = require('./controllers/contactController')
const helpers = require('./utils/helpers')
const messageController = require('./controllers/messageController')
const levelingController = require('./controllers/levelingController')
const adminController = require('./controllers/adminController')
const wppController = require('./controllers/wppController')
const nlpController= require('./controllers/nlpController')

client.on('message', async msg => {
    // if chat, check keyword -> nlp

    /**
     *  
     *  // cron rodando a cada 1h
     * pega todas msgs que nextstate = now,
     * faz fila de envio com diferença de x segundos.
     * 
     *  // Msg
     * Recebe msg
     * Verifica se já existe usuario ? verifica tipo da msg : cria usuario e envia para sequencia nivelamento
     */

    //await nlpController.nlp(msg)
    //await adminController.checkAdminResponses(msg)
    //await wppController.notifyAdmins(msg)
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
            //await nlpController.nlp(msg)
        }
    }
});