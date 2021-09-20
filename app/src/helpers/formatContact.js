const firstName = require('./firstname')

exports.formatContact = async (data) => {
    const contact = await data.getContact(data)
    let contactName = contact.verifiedName ? contact.verifiedName : contact.pushname
    const fname = firstName(contactName)
    let user = {
        fname,
        name: contactName,
        email: '',
        number: data.from,
        state: 0
    }
    return user;
}