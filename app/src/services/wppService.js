const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');

const SESSION_FILE_PATH = '../../manyzap.json';

let sessionData;
//if (fs.existsSync(SESSION_FILE_PATH)) {
//sessionData = require(SESSION_FILE_PATH);
//}
const client = new Client({
    session: sessionData
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot iniciado com sucesso');
});

client.on('authenticated', (session) => {
    console.log('sessão :', session)
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), { flag: 'w' }, (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.initialize();

module.exports = client;