const [ client, q ] = require('../services/faunaService')


exports.createContact = async (data) => {
    const contact = await client.query(
        q.Create(q.Collection('contact'), {
            data: data
        })
    ).catch(err => {
        console.log(err)
    })
    return contact;
}

exports.checkContactExists = async (data) => {
    const contact = await client.query(
        q.Let({
            userExists: q.Exists(
              q.Match(q.Index('contact_by_number'), data.number)
            )
          },
            q.If(
              q.Var('userExists'),
              q.Get(q.Match(q.Index('contact_by_number'), data.number)),
              q.Create(q.Collection('contact'), { data: data })
            )
          )
    )
    return contact;
}

