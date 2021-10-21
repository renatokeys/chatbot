const [client, q] = require('../services/faunaService')


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

exports.updateContactName = async (number, name) => {
    const contact = await client.query(
        q.Let({
            doc: q.Get(q.Match(q.Index('contact_by_number'), number))
        },
            q.Update(q.Select(['ref'], q.Var('doc')), {
                data: {
                    name: name,
                }
            })
        )
    )
    return contact;
}

exports.updateContactState = async (number, state) => {
    const contact = await client.query(
        q.Let({
            doc: q.Get(q.Match(q.Index('contact_by_number'), number))
        },
            q.Update(q.Select(['ref'], q.Var('doc')), {
                data: {
                    state: state,
                }
            })
        )
    )
    return contact;
}

exports.updateResp = async (number, resp) => {
    const contact = await client.query(
        q.Let({
            doc: q.Get(q.Match(q.Index('contact_by_number'), number))
        },
            q.Update(q.Select(['ref'], q.Var('doc')), {
                data: {
                    answer: q.Append(resp, q.Select(['data', 'answer'], q.Var('doc'))),
                }
            })
        )
    )
    return contact;
}

exports.updateContactRecipes = async (number, recipeNumber) => {
    const contact = await client.query(
        q.Let({
            doc: q.Get(q.Match(q.Index('contact_by_number'), number))
        },
            q.Update(q.Select(['ref'], q.Var('doc')), {
                data: {
                    recipes: q.Append(recipeNumber, q.Select(['data', 'recipes'], q.Var('doc')))
                }
            })
        )
    )
    return contact;
}
