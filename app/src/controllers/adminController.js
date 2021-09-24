const [ client, q ] = require('../services/faunaService')
const nlpController = require('./nlpController')
const wppController = require('./wppController')

const getAdmins = exports.getAdmins = async () => {
    const admins = await client.query(
        q.Map(
            q.Paginate(q.Documents(q.Collection('admin'))),
            q.Lambda( 'x', q.Get(q.Var('x')))
        )
    )
    return admins.data
}

exports.checkAdminResponses = async (msg) => {
    let adminList = []
    const admins = await getAdmins()
    for(let i=0; i<admins.length; i++) {
        adminList.push(admins[i].data.number)
    }
    if(adminList.indexOf(msg.from.split('@c.us')[0]) > -1) {
        const response = await msg.getQuotedMessage()
        if(response){
            const usuario = await nlpController.checkAnswerProcess(response)
            if(usuario){
                let data = {
                    from: usuario,
                    body: msg.body
                }
                await wppController.sendText(data)
            }
        }
        
        // pegar essa msg e achar o dono, enviar msg.body para ele
        // msg.body = intent
        // response.body = answer
        return true
    }
    return false
}