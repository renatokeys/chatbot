var cron = require('node-cron');

const messages = []
cron.schedule('1 0 * * *', () => {
    // get every day a list of messages from from date ( today )
    // add msgs no array de msg
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"  // use Brazil timezone
});

export { messages }