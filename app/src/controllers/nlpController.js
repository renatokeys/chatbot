const manager = require('../services/nlpService')
const forwardedMessages = []

exports.nlp = async (msg) => {
    const resp = await detectIntent(msg.body)
    // if(resp.score > 0){ 
    // A resposta mais próxima desta mensagem é ${resp.answer} do intent : ${resp.intent}\n\nOutras possiveis respostas que já sei responder\n\n${resp.?answers[0]?.intent}\n${resp.?answers[1]?.intent}\n${resp?.answers[2]?.intent}    
    
}
exports.addAnswerProcess = async (msg) =>{
    forwardedMessages.push({
        user: msg.from,
        text: msg.body
    })
}

exports.checkAnswerProcess = async (msg) => {
    const found = forwardedMessages.find( data => data.text === msg.body).user;
    if(found){
        forwardedMessages.splice(forwardedMessages.findIndex(x => x.text === msg.body), 1);
        return found
    }
}

async function inicia(){
    addIntent('olá', 'hello')
    addIntent('oi', 'hello')
    addIntent('oii', 'hello')
    addIntent('oie', 'hello')
    addIntent('oiie', 'hello')
    addIntent('Qual a forma de pagamento?', 'payment')
    addIntent('Posso pagar pix?', 'payment')
    addIntent('Posso pagar cartão?', 'payment')
    addIntent('Posso pagar boleto?', 'payment')
    addIntent('Onde encontro os materiais?', 'materials')
    addIntent('quais os materiais?', 'materials')
    addIntent('como encontro os materiais?', 'materials')
    addIntent('É mensalidade?', 'duration')
    addIntent('paga todo mes?', 'duration')
    addIntent('Tem que pagar algo a mais?', 'duration')
    addIntent('Paga uma vez só?', 'duration')
    addIntent('As receitas são em video aula?', 'recipesVideo')
    addAnswer('Temos Vídeo aulas de receitas porém nos temos mais de cinco mil receitas, ainda não temos todas com vídeo, mas estamos sempre adicionando novas vídeo aulas.', 'recipesVideo')
    addIntent('Posso baixar as receitas?', 'recipe')
    addIntent('tem quais receitas?', 'recipeHave')
    addIntent('Atualmente temos mais de cinco mil receitas e por aqui fica dificil te mostrar todas mas você pode ver algumas delas no link https://www.amigurumicia.club/galeria2?src=wpp', 'recipeHave')
    addIntent('posso estar imprimindo as receitas?', 'recipe')
    addIntent('Posso fazer download das receitas?', 'recipe')
    addIntent('vem quantas receitas?', 'recipeMuch')
    addAnswer('Atualmente temos 5039 receitas com passo a passo detalhado, estamos sempre adicionando mais', 'recipeMuch')
    addIntent('as receitas tem todo o passo a passo?', 'recipeHow')
    addAnswer('Sim, todas a receitas com passo a passo detalhado e em português', 'recipeHow')
    addAnswer('Sim você poderá baixar e imprimir as receitas!', 'recipe')
    addAnswer('Você paga apenas uma vez e tem acesso vitalício!', 'duration')
    addAnswer('Você encontra em lojas de artesanato, papelarias e também em site na internet como mercado livre, armarinho do são jose entre outros.', 'materials')
    addAnswer('Aceitamos Cartão de crédito, pix e boleto, pagamento no cartão e pix o acesso é imediato, pagamento via boleto o prazo é de 3 dias úteis', 'payment')
    ////////////////////////////
    addAnswer('Oiie', 'hello')
    addAnswer('Olá', 'hello')
    addAnswer('Oi', 'hello')
    addAnswer('Oie', 'hello')
    /////////
    addIntent('quem é você', 'who')
    addIntent('quem e voce?', 'who')
    addIntent('quem e ?', 'who')
    addIntent('qual seu nome', 'who')
    addAnswer('Eu sou a Babi, atendente do Arts Amigurumi', 'who')


}
const detectIntent = exports.detectIntent = async (text) => {
    const response = await manager.process('pt', text);
    return response
}

const addIntent= async (text, intent) => {
    manager.addDocument('pt', text, intent);
    await manager.train();
    manager.save();
}

const addAnswer= async (text, intent) => {
    manager.addAnswer('pt', intent, text);
    await manager.train();
    manager.save();
}