const client = require('./services/wppService');
const controller = require('./controllers/contactController')
const keywordController = require('./controllers/keywordController')
const helpers = require('./helpers/formatContact')
const messageController = require('./controllers/messageController')
const wppController = require('./controllers/wppController')

client.on('message', async msg => {
    const user = await helpers.formatContact(msg)
    let contact = await controller.checkContactExists(user);
    if(contact.data.state === 0) {  // novo contato
        const isKeyword = await keywordController.get_keyword_by_keyname(msg.body)
        if(isKeyword){
            const resp = await messageController.getMessageByState(contact.data.state)
            if(resp.data.type === 'button'){
                await wppController.sendButton(msg, resp.data)
            }
        } else {
            if(msg.type === 'chat') {
                console.log('nlp')
            } else if(msg.type === 'buttons_response') {
                const resp = await messageController.getMessageByResponse(msg.body)
                if(resp.data.state === contact.data.state){
                    // aceitar resposta
                    // mudar state + 1
                } else if(resp.data.state < contact.data.state) {
                    await client.sendMessage(msg.from, 'Desculpe, você já respondeu a esta mensagem.')
                }
            }
            
        }
    }
    else { 
        // pega msg by state
    }
    


    // await controller.createContact({
    //     name: 'teste',
    //     email: 'teste@teste.com',
    //     number: msg.from,
    //     state: 0
    // }).catch(err => console.log(err)).finally(data => console.log(data))



    //let user = await userController.userExists(msg.from)
    //if(user.level === 0) {
//
    //    // verifica se tem keyword de inicio de nivelamento, envia p nivelamento
    //    // else nlp
    //} else {
//
    //}
});