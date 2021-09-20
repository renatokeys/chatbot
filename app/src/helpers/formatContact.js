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
        state: 0,
        answer: []
    }
    return user;
}

exports.getUrl = async (data) => {
    switch(data){
        case 'Receita 1':
            return 'url da receita 1'
            break;
        case 'Receita 2':
            return 'url da receita 2'
            break;
        case 'Receita 3':
            return 'url da receita 3'
            break;
    }
}