const [client, q] = require('../services/faunaService2')
const messageController = require('./messageController')


const getSequenceByName = exports.getSequenceByName = async function getSequenceByName(name) {
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
    const validateTime = (min, max, msgDate) => {
        var date = new Date(msgDate);
        var hours = date.getHours();
        if (hours >= min && hours <= max) return msgDate
        const diff = ((24 - hours) + min) * 3600
        return msgDate + diff
    }
    sequence.messages.map(async (value, index) => {
        curTime += value.time
        let msgDate = now + curTime
        if (value.limit_min || value.limit_max) {
            msgDate = validateTime(value.limit_min, value.limit_max, msgDate)
            curTime = msgDate
        }
        await messageController.addMessageFromSequence({
            number,
            message: value.id,
            date: msgDate
        }).catch(err => console.log(err))
    })

    // ver resposta do usuario
    // adicionar o usuario no cron_users_sequence com as msg da sequencia pel
}

