const [client, q] = require('../services/faunaService')

exports.getMessageByState = async (state) => {
    const messages = await client.query(
        q.Get(q.Match(q.Index('message_by_state'), state))
    )
    return messages
}
exports.getMessageByResponse = async (response) => {
    const messages = await client.query(
        q.Get(q.Match(q.Index('message_by_text'), response))
    )
    return messages
}

exports.addMessageFromSequence = async (data) => {
    const addMessage = await client.query(
        q.Create(q.Collection('cron_user_sequence'), {
            data: data
        })
    )
    return addMessage
}

exports.getMessagesFromDay = async (day, allMsg) => {
    const messages = await client.query(
        q.Paginate(q.Match(q.Index('messages_by_day'), day))
    )
    messages.data.map(async (value) => {
        const message = await client.query(
            q.Get(value)
        )
        allMsg.push(message.data)
    })

}
