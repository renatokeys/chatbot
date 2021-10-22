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
    console.log(sequence)
    let curTime = 0
    const now = Date.now()
    sequence.messages.map(async (value, index) => {
        curTime += value.time
        let msgDate = now + curTime
        var date = new Date(msgDate);
        // Hours part from the timestamp
        var hours = date.getHours();
        console.log(hours)
        // limit_min 
        // limit_max
        // verificar se o tempo da msg vai estar dentro do limite, se n tiver add x horas até o prox min hora e add time ao curTime
        // verificar se a msg vai ser no mesmo dia de hoje, se sim -> atualiza a lista do cron 


        await messageController.addMessageFromSequence({
            number,
            message: value.id,
            date: msgDate
        })
    })

    // ver resposta do usuario
    // adicionar o usuario no cron_users_sequence com as msg da sequencia pel
}

