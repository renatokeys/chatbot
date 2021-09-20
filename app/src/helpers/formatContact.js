const firstName = require("./firstname");

exports.formatContact = async (data) => {
    const contact = await data.getContact(data);
    let contactName = contact.verifiedName ? contact.verifiedName : contact.pushname;
    const fname = firstName(contactName);
    let user = {
        fname,
        name: contactName,
        email: "",
        number: data.from,
        state: 0,
        answer: [],
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
                        name: "BONECA COM VESTIDO ROSA",
                        id: "73",
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
