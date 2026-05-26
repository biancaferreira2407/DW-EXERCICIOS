const express = require('express');
const os = require('os');
const { json } = require('stream/consumers');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS para permitir qualquer origem
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // '*' permite qualquer origem
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//se vier uma requisição POST para a rota /enviar-mensagem, o servidor irá processar a mensagem recebida, convertê-la para maiúsculas e enviar uma resposta de volta ao cliente.
app.post('/enviar-mensagem', (req, res) => {

    // usar "destructuring" do JavaScript (mais elegante):
    // const { mensagem, x, y } = req.body; //cria 3 variáveis: mensagem, x e y, e atribui os valores correspondentes do objeto req.body a elas.


    //Passo 1: Capturar os dados enviados pelo cliente (x e y) a partir do corpo da requisição (req.body) e armazená-los em variáveis para uso posterior.

    //modo tradicional: capturar os dados do corpo da requisição (req.body) e armazená-los em variáveis separadas para uso posterior.
    //req é o pacoteDeDados que o cliente enviou para o servidor, e body é a parte do pacote que contém os dados enviados pelo cliente.

    let x = req.body.x; //pegue o valor de x que está no corpo da requisição e armazene-o na variável x. O cliente deve enviar um objeto JSON com uma propriedade "x" para que isso funcione corretamente.
    let y = req.body.y; //pegue o valor de y que está no corpo da requisição e armazene-o na variável y. O cliente deve enviar um objeto JSON com uma propriedade "y" para que isso funcione corretamente.

    console.log(`As coordenadas recebidas foram: (${x}, ${y})`);

    // Passo 2. Realiza o cálculo de pitágoras usando os valores de x e y recebidos do cliente. O resultado é armazenado na variável h.
    let h = Math.hypot(x, y);

    //  Enviar um objeto (pacotinho) de volta para o cliente, contendo o resultado do cálculo.


    // Passo 3: Criar um objeto chamado pacoteComResposta
    const pacoteComResposta = {
        hipotenusa: h  // colocar o valor da hipotenusa neste objeto
    };

    // Passo 4: Enviar de volta para o cliente usando res.json()
    res.json(pacoteComResposta); //envia o objeto pacoteComResposta de volta para o cliente em formato JSON. O cliente receberá uma resposta contendo a hipotenusa calculada com base nos valores de x e y enviados.
});

const obterIP = () => {
    const interfaces = os.networkInterfaces();
    for (let nomeInterface in interfaces) {
        for (let info of interfaces[nomeInterface]) {
            if (info.family === 'IPv4' && !info.internal) return info.address;
        }
    }
    return 'localhost';
};

const ip = obterIP()

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://${ip}:${port}`)
})
