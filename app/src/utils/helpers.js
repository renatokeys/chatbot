'use strict';

const usersChangingName = []

exports.firstName = (userName) => {
    var fname = userName;
    if (/\s/.test(fname)) {
        fname = userName.split(" ")[0];
    }
    fname = fname.toLowerCase()
    fname = fname.charAt(0).toUpperCase() + fname.slice(1);
    return fname;
};

exports.formatContact = async (data) => {
    const contact = await data.getContact(data);
    const picurl = await contact.getProfilePicUrl()
    let contactName = contact.verifiedName ? contact.verifiedName : contact.pushname;
    const fname = firstName(contactName);
    let user = {
        fname,
        picurl,
        name: contactName,
        email: "",
        number: data.from,
        state: 0,
        answer: [],
        recipes: []
    };
    return user;
};

exports.getUrl = (data, liked) => {
    switch (liked) {
        case "Bonecos":
            switch (data) {
                case "Receita 1":
                    return {
                        name: "BONECA STELLA",
                        id: "43",
                    };
                    break;
                case "Receita 2":
                    return {
                        name: "Boneca Ava",
                        id: "66",
                    };
                    break;
                case "Receita 3":
                    return {
                        name: "BONECO JONATHAN",
                        id: "185",
                    };
                    break;
            }
            break;
        case "Animais":
            switch (data) {
                case "Receita 1":
                    return {
                        name: "CACHORRO PASTOR ALEMÃO",
                        id: "89",
                    };
                    break;
                case "Receita 2":
                    return {
                        name: "TURMA DO URSINHO POOH",
                        id: "157",
                    };
                    break;
                case "Receita 3":
                    return {
                        name: "URSINHO REAL",
                        id: "143",
                    };
                    break;
            }
            break;
        case "Desenhos":
            switch (data) {
                case "Receita 1":
                    return {
                        name: "HOMEM DE FERRO",
                        id: "379",
                    };
                    break;
                case "Receita 2":
                    return {
                        name: "MUNDO BITA",
                        id: "109",
                    };
                    break;
                case "Receita 3":
                    return {
                        name: "PEPPA PIG",
                        id: "286",
                    };
                    break;
            }
            break;
        case "Comidas":
            switch (data) {
                case "Receita 1":
                    return {
                        name: "PÊRA FELIZ",
                        id: "5",
                    };
                    break;
                case "Receita 2":
                    return {
                        name: "SORVETINHO",
                        id: "208",
                    };
                    break;
                case "Receita 3":
                    return {
                        name: "CROCHET DONUT",
                        id: "434",
                    };
                    break;
            }
            break;
        case "Religiosas":
            switch (data) {
                case "Receita 1":
                    return {
                        name: "PRESÉPIO NATALINO",
                        id: "1038",
                    };
                    break;
                case "Receita 2":
                    return {
                        name: "JOSÉ",
                        id: "94",
                    };
                    break;
                case "Receita 3":
                    return {
                        name: "SENHOR",
                        id: "97",
                    };
                    break;
            }
            break;
        case "Natalinas":
            switch (data) {
                case "Receita 1":
                    return {
                        name: "MAMÃE NOEL",
                        id: "1083",
                    };
                    break;
                case "Receita 2":
                    return {
                        name: "PAPAI NOEL",
                        id: "1084",
                    };
                    break;
                case "Receita 3":
                    return {
                        name: "RENAS GÊMEAS",
                        id: "95",
                    };
                    break;
            }
            break;
    }
};

exports.formartName = (string) => {
    const prefix = ['prefiro que ', 'me chame ', 'igual minha ', 'mãe ',', ','pode me chamar de ', 'pode me chamar ', 'eu gosto que ', 'me chame de ', 'me chamo ',' pode chamar ','meu nome é ','meu nome e ', 'meu nome ','eu sou ', 'sou o ', 'me chama de ']
    let name = string.toLowerCase();
    prefix.forEach(prefixString => { 
        if(name.includes(prefixString)){
            name = name.replace(prefixString, '')
        } })
    return name;
}

exports.formatChoose = (data, level) => {
    let choose = data;
    switch(data) {
        case 'Vai ser meu primeiro Amigurumi':
            choose = 'vai ser seu primeiro amigurumi então irei separar algumas vídeo aulas para você seguir e fazer seu primeiro amigurumi.'
        case 'Já faço e vendo, quero mais modelos':
            level += 1
            choose = 'já faz amigurumis para vender então irei separar 3 receitas para você escolher uma e faturar bastante rsrs'
        case 'Já fiz alguns mais simples':
            level += 1
            choose = 'ja fez alguns simples então irei separar 3 receitas de nível médio para você, você vai amar!'
    }
    return choose, level;
}

exports.getSupportName = () => {
    const fname = ['Suelem', 'Leticia','Amanda','Marcela','Patricia','Maria','Lorena','Joana','Julia','Junia','Juliana','Sthefanie','Sara','Sueli','Vanessa']
    const lname = ['Soares', 'Santos', 'Silva','Oliveira', 'Alves', 'Pereira', 'Rodrigues','Ferreira', 'Gomes', 'Martins']
    var getFirstName = Math.floor(Math.random()*fname.length)
    var getLastName = Math.floor(Math.random()*lname.length)
    const assistantName = `${fname[getFirstName]} ${lname[getLastName]}` 
    return assistantName;
}