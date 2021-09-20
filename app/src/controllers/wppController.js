const { List, Buttons } = require('whatsapp-web.js');
const client = require('../services/wppService')

exports.sendButton = async (msg, data) => {
    let buttons = []
    data.buttons.map((button) => {
        buttons.push({
            body: button.text
        })
    })
    let button = new Buttons(data.body, buttons, data.title, data.footer);
    setTimeout(async () => { await client.sendMessage(msg.from, button) }, data.delay)
    console.log(button)
}
