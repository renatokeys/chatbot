var cron = require('node-cron');
const message = require('./getMessages')

cron.schedule('1 * * * *', () => {
    // run message array and check if 
    //
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"  // use Brazil timezone
});