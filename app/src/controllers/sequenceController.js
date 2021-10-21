const [client, q] = require('../services/faunaService2')
const messageController = require('./messageController')


exports.getSequenceByName = async function getSequenceByName(name) {
    const resp = await client.query(
        q.Get(
            q.Match(
                q.Index('sequence_by_name'), name
            )
        )
    )
    return resp.data
}



exports.addUserSequence = async function addUsertoSequenceByLevelingChoose({ number, seq }) {
    const sequence = await getSequenceByName(seq)
    let curTime = 0
    const now = Date.now()
    sequence.messages.map(async (value, index) => {
        curTime += value.time

        await messageController.addMessageFromSequence({
            number,
            message: value.id,
            date: now + curTime,
        })
    })

    // ver resposta do usuario
    // adicionar o usuario no cron_users_sequence com as msg da sequencia pel
}