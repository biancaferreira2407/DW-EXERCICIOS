const { query } = require('../database');

// Listar todos os forma_pagamento
exports.listarformaPagamento = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.forma_pagamento ORDER BY id_forma_pagamento');
        res.json({ sucesso: true, forma_pagamentos: result.rows });
    } catch (error) {
        console.error('Erro ao listar forma_pagamentos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar forma_pagamentos.' });
    }
};

// Obter forma_pagamento por ID
exports.obterformaPagamento = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido (deve ter até 2 caracteres).' });
        }

        const result = await query('SELECT * FROM public.forma_pagamento WHERE id_forma_pagamento = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'forma_pagamento não encontrado.' });
        }

        res.json({ sucesso: true, forma_pagamento: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter forma_pagamento:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar forma_pagamento
exports.criarformaPagamento = async (req, res) => {
    try {
        const { id_forma_pagamento, nome_forma_pagamento } = req.body;
        const id = id_forma_pagamento ? id_forma_pagamento.trim().toUpperCase() : '';

        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'A sigla/ID deve ter até 2 caracteres.' });
        }

        if (!nome_forma_pagamento) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do forma_pagamento é obrigatório.' });
        }

        const sql = `
            INSERT INTO public.forma_pagamento (id_forma_pagamento, nome_forma_pagamento)
            VALUES ($1, $2)
            RETURNING *
        `;

        const result = await query(sql, [id, nome_forma_pagamento]);
        res.status(201).json({ sucesso: true, mensagem: 'forma_pagamento inserido com sucesso!', forma_pagamento: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar forma_pagamento:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Este id de forma_pagamento já está cadastrada.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir forma_pagamento no banco de dados.' });
    }
};

// Atualizar forma_pagamento
exports.atualizarformaPagamento = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        const { nome_forma_pagamento } = req.body;

        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const sql = `
            UPDATE public.forma_pagamento 
            SET nome_forma_pagamento = $1 
            WHERE id_forma_pagamento = $2
            RETURNING *
        `;

        const result = await query(sql, [nome_forma_pagamento, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'forma_pagamento não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'forma_pagamento alterado com sucesso!', forma_pagamento: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar forma_pagamento:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar forma_pagamento.' });
    }
};

// Deletar forma_pagamento
exports.deletarformaPagamento = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';

        if (!id || id.length > 2) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        await query('DELETE FROM public.forma_pagamento WHERE id_forma_pagamento = $1', [id]);

        res.json({ sucesso: true, mensagem: 'forma_pagamento excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar forma_pagamento:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem funcionários associados a este forma_pagamento.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir forma_pagamento.' });
    }
};