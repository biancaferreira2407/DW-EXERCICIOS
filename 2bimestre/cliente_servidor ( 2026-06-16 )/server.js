const express = require('express');
const os = require('os');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS (Verificação de origem da Servidorina)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Rota Única: Enviar e Receber Mensagens (POST)
app.post('/api/mensagens', async (req, res) => {
    try {
        
        if (!req.body.mensagem) {
    return res.status(400).json({
        status: "erro",
        mensagem: "Mensagem em branco!"
    });
}

const mensagemRecebida = req.body.mensagem
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");



        if (!mensagemRecebida) {
            return res.status(400).json({ status: "erro", mensagem: "Mensagem em branco!" });
        }

        const agora = new Date();
        const dataHora = `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
        console.log(`Mensagem recebida: ${mensagemRecebida} - ${dataHora}`);

        if (mensagemRecebida.startsWith("ESTADO ")) {
            try {

                const partes = mensagemRecebida.split(/\s+/);
                const sigla = partes[1].toUpperCase();

                const verificaEstado = await pool.query(
                    "SELECT * FROM public.estado WHERE sigla_estado = $1",
                    [sigla]
                );

                if (verificaEstado.rows.length === 0) {
                    return res.status(200).json({
                        status: "sucesso",
                        mensagem: "Estado não cadastrado."
                    });
                }

                const query = `
                SELECT id_cidade, nome_cidade
                FROM public.cidade
                WHERE sigla_estado = $1
                ORDER BY nome_cidade
                `;

                const result = await pool.query(query, [sigla]);

                if (result.rows.length === 0) {
                    return res.status(200).json({
                        status: "sucesso",
                        mensagem: "Nenhuma cidade encontrada para esse estado."
                    });
                }

                let mensagemResposta = `Cidades do estado ${sigla}:\n`;

                result.rows.forEach(cidade => {
                    mensagemResposta += `${cidade.id_cidade} - ${cidade.nome_cidade}\n`;
                });

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });

            } catch (erro) {
                console.error(erro);
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao consultar o estado"
                });
            }
        }

        else if (mensagemRecebida === "TODAS AS CIDADES") {
            try {

                const query = `
                SELECT
                id_cidade,
                nome_cidade
                FROM public.cidade
                `;

                const result = await pool.query(query);

                let mensagemResposta = "Cidades cadastradas:\n";

                result.rows.forEach(cidade => {
                    mensagemResposta += `${cidade.id_cidade} - ${cidade.nome_cidade}\n`;
                });

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });

            } catch (erro) {
                console.error(erro);
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao consultar as cidades"
                });
            }
        }

        else if (mensagemRecebida === "TODOS OS ESTADOS") {
            try {

                const query = `
                SELECT
                nome_estado, sigla_estado
                FROM public.estado
                `;

                const result = await pool.query(query);

                let mensagemResposta = "Estados cadastrados:\n";

                result.rows.forEach(estado => {
                    mensagemResposta += ` ${estado.sigla_estado} - ${estado.nome_estado}\n`;
                });

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });

            } catch (erro) {
                console.error(erro);
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao consultar os estados"
                });
            }
        }

        else if (mensagemRecebida === "TODAS AS CIDADES E ESTADOS") {
            try {

                const query = `
                SELECT
                c.id_cidade,
                c.nome_cidade,
                e.nome_estado
                FROM public.cidade c
                INNER JOIN public.estado e
                ON c.sigla_estado = e.sigla_estado
                ORDER BY c.id_cidade
                `;

                const result = await pool.query(query);

                let mensagemResposta = "Cidades e Estados cadastrados:\n";

                result.rows.forEach(cidade => {
                    mensagemResposta += `${cidade.id_cidade} - ${cidade.nome_cidade} - ${cidade.nome_estado}\n`;
                });

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });

            } catch (erro) {
                console.error(erro);
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao consultar"
                });
            }
        }

        else if (mensagemRecebida.startsWith("CIDADE ")) {
            try {

                const cidade = mensagemRecebida.substring(7).trim();

                const query = `
            SELECT id_cidade, nome_cidade
            FROM public.cidade
           WHERE UPPER(unaccent(nome_cidade)) = $1
        `;

                const result = await pool.query(query, [cidade]);

                if (result.rows.length > 0) {
                    return res.status(200).json({
                        status: "sucesso",
                        mensagem: `ID: ${result.rows[0].id_cidade} - Cidade: ${result.rows[0].nome_cidade}`
                    });
                }

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: "Cidade não encontrada."
                });

            } catch (erro) {
                console.error(erro);
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao consultar a cidade"
                });
            }
        }

        // REGRA 4: Qualquer outra palavra
        else {
            return res.status(200).json({
                status: "sucesso",
                mensagem: "mensagem não entendida"
            });
        }

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ status: "erro", mensagem: 'Erro interno do Servidor' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor atento na porta ${port}`);
    console.log(`Rota disponível:`);
    console.log(`  POST http://localhost:${port}/api/mensagens - Enviar`);
    console.log(`\nMensagens disponíveis (possíveis)`);
    console.log(`  "todas as cidades"     -> Lista todas as cidades`);
    console.log(`  "todas os estados"     -> Lista todas os estados`);
    console.log(`  "todas as cidades e estados"     -> Lista todas as cidades e estados`);
    console.log(`  "cidade X"  -> Consulta uma cidade`);
    console.log(`  "estado XX" -> Lista cidades do estado`);
    console.log(`  (outras)   -> Mensagem será verificada`);
});


