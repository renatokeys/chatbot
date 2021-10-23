const [client, q] = require('../services/faunaService2')
const messageController = require('./messageController')
const { messages } = require('../jobs/getMessages')

exports.getMessage = async function getMessage(ref) {
    const message = await client.query(
        q.Get(q.Ref(q.Collection('messages'), ref))
    ).catch(err => console.log(err))
    return message
}


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

const isToday = (someDate) => {
    const today = new Date()
    if (someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth()) {
        return true
    }
    return false
}

exports.addUserSequence = async function addUsertoSequenceByLevelingChoose({ number, seq }) {
    const sequence = await getSequenceByName(seq)
    let curTime = 0
    const now = Date.now() / 1000

    const validateTime = (min, max, msgDate) => {
        var date = new Date(msgDate * 1000);
        var hours = date.getHours();
        if (hours >= min && hours <= max) return msgDate
        let diff = ((24 - hours) + min)
        diff = diff * 3600
        const finalDate = msgDate + diff
        return finalDate
    }
    sequence.messages.map(async (value, index) => {
        curTime += value.time
        let msgDate = now + curTime
        let finalDate = msgDate
        if (value.limit_min || value.limit_max) {
            finalDate = validateTime(value.limit_min, value.limit_max, msgDate)
            curTime = finalDate - msgDate + curTime
        }
        var finalData = new Date(finalDate * 1000);
        const msgData = `${finalData.getDate()}/${finalData.getMonth() + 1}/${finalData.getFullYear()}`
        if (isToday(finalData)) {
            messages.push({
                number,
                message: value.id,
                date: finalDate,
                day: msgData
            })
        }
        await messageController.addMessageFromSequence({
            number,
            message: value.id,
            date: finalDate,
            day: msgData
        }).catch(err => console.log(err))
    })
}

