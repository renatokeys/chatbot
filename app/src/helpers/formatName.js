exports.formartName = (string) => {
    const prefix = ['prefiro que ', 'me chame ', 'igual minha ', 'mãe ',', ','pode me chamar de ', 'pode me chamar ', 'eu gosto que ', 'me chame de ', 'me chamo ',' pode chamar ','meu nome é ','meu nome e ', 'meu nome ','eu sou ', 'sou o ', 'me chama de ']
    let name = string.toLowerCase();
    prefix.forEach(prefixString => { 
        if(name.includes(prefixString)){
            name = name.replace(prefixString, '')
        } })
    return name;
}