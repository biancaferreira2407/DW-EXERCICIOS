const { pool } = require('../database');

function numeroValido(valor) {
    return Number.isFinite(Number(valor));
}

exports.criarPedido = async (req, res) => {
    const {
        data_pedido,
        cliente_pessoa_cpf_pessoa,
        funcionario_pessoa_cpf_pessoa,
        produtos,
        pagamentos
    } = req.body;

    if (!data_pedido) {
        return res.status(400).json({ sucesso: false, mensagem: 'A data do pedido é obrigatória.' });
    }

    if (!Array.isArray(produtos) || produtos.length === 0) {
        return res.status(400).json({ sucesso: false, mensagem: 'O pedido precisa ter pelo menos um produto.' });
    }

    if (!Array.isArray(pagamentos) || pagamentos.length === 0) {
        return res.status(400).json({ sucesso: false, mensagem: 'O pedido precisa ter pelo menos uma forma de pagamento.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Confere cliente, quando informado.
        if (cliente_pessoa_cpf_pessoa) {
            const cliente = await client.query(
                'SELECT 1 FROM public.cliente WHERE pessoa_cpf_pessoa = $1',
                [cliente_pessoa_cpf_pessoa]
            );

            if (cliente.rowCount === 0) {
                throw new Error('Cliente informado não está cadastrado como cliente.');
            }
        }

        // Confere funcionário, quando informado.
        if (funcionario_pessoa_cpf_pessoa) {
            const funcionario = await client.query(
                'SELECT 1 FROM public.funcionario WHERE pessoa_cpf_pessoa = $1',
                [funcionario_pessoa_cpf_pessoa]
            );

            if (funcionario.rowCount === 0) {
                throw new Error('Funcionário informado não está cadastrado como funcionário.');
            }
        }

        // Insere o pedido e deixa o PostgreSQL gerar o ID pela sequence.
        const pedidoResult = await client.query(
            `INSERT INTO public.pedido
                (data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                data_pedido,
                cliente_pessoa_cpf_pessoa || null,
                funcionario_pessoa_cpf_pessoa || null
            ]
        );

        const pedido = pedidoResult.rows[0];
        let valorTotal = 0;

        // Produtos: pega o preço atual do banco e grava esse preço no pedido.
        for (const item of produtos) {
            const idProduto = Number(item.produto_id_produto);
            const quantidade = Number(item.quantidade);

            if (!Number.isInteger(idProduto) || !Number.isInteger(quantidade) || quantidade <= 0) {
                throw new Error('Produto ou quantidade inválida.');
            }

            const produtoResult = await client.query(
                `SELECT id_produto, nome_produto, quantidade_estoque_produto, preco_unitario_produto
                 FROM public.produto
                 WHERE id_produto = $1
                 FOR UPDATE`,
                [idProduto]
            );

            if (produtoResult.rowCount === 0) {
                throw new Error(`Produto ${idProduto} não encontrado.`);
            }

            const produto = produtoResult.rows[0];
            const estoque = Number(produto.quantidade_estoque_produto || 0);
            const preco = Number(produto.preco_unitario_produto || 0);

            if (quantidade > estoque) {
                throw new Error(`Estoque insuficiente para o produto "${produto.nome_produto}". Disponível: ${estoque}.`);
            }

            valorTotal += quantidade * preco;

            await client.query(
                `INSERT INTO public.pedido_has_produto
                    (produto_id_produto, pedido_id_pedido, quantidade, preco_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [idProduto, pedido.id_pedido, quantidade, preco]
            );

            await client.query(
                `UPDATE public.produto
                 SET quantidade_estoque_produto = quantidade_estoque_produto - $1
                 WHERE id_produto = $2`,
                [quantidade, idProduto]
            );
        }

        // Evita diferenças causadas por ponto flutuante.
        valorTotal = Math.round(valorTotal * 100) / 100;

        let valorPagoTotal = 0;

        for (const pagamento of pagamentos) {
            const idForma = Number(pagamento.forma_pagamento_id_forma_pagamento);
            const valorPago = Number(pagamento.valor_pago);

            if (!Number.isInteger(idForma) || !numeroValido(valorPago) || valorPago <= 0) {
                throw new Error('Forma de pagamento ou valor pago inválido.');
            }

            const formaResult = await client.query(
                'SELECT 1 FROM public.forma_pagamento WHERE id_forma_pagamento = $1',
                [idForma]
            );

            if (formaResult.rowCount === 0) {
                throw new Error(`A forma de pagamento ${idForma} não existe.`);
            }

            valorPagoTotal += valorPago;
        }

        valorPagoTotal = Math.round(valorPagoTotal * 100) / 100;

        if (Math.abs(valorPagoTotal - valorTotal) > 0.009) {
            throw new Error(`O total pago (${valorPagoTotal.toFixed(2)}) deve ser igual ao total do pedido (${valorTotal.toFixed(2)}).`);
        }

        await client.query(
            `INSERT INTO public.pagamento
                (pedido_id_pedido, data_pagamento, valor_total_pagamento)
             VALUES ($1, CURRENT_TIMESTAMP, $2)`,
            [pedido.id_pedido, valorTotal]
        );

        for (const pagamento of pagamentos) {
            await client.query(
                `INSERT INTO public.pagamento_has_forma_pagamento
                    (pagamento_id_pedido, forma_pagamento_id_forma_pagamento, valor_pago)
                 VALUES ($1, $2, $3)`,
                [
                    pedido.id_pedido,
                    Number(pagamento.forma_pagamento_id_forma_pagamento),
                    Number(pagamento.valor_pago)
                ]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            sucesso: true,
            mensagem: 'Pedido criado com sucesso!',
            pedido: {
                ...pedido,
                valor_total: valorTotal
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar pedido:', error);

        res.status(400).json({
            sucesso: false,
            mensagem: error.message || 'Não foi possível criar o pedido.'
        });
    } finally {
        client.release();
    }
};

exports.listarPedidos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id_pedido,
                p.data_pedido,
                pc.nome_pessoa AS nome_cliente,
                pf.nome_pessoa AS nome_funcionario,
                pg.valor_total_pagamento AS valor_total
            FROM public.pedido p
            LEFT JOIN public.pessoa pc
                ON pc.cpf_pessoa = p.cliente_pessoa_cpf_pessoa
            LEFT JOIN public.pessoa pf
                ON pf.cpf_pessoa = p.funcionario_pessoa_cpf_pessoa
            LEFT JOIN public.pagamento pg
                ON pg.pedido_id_pedido = p.id_pedido
            ORDER BY p.id_pedido DESC
        `);

        res.json({ sucesso: true, pedidos: result.rows });
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pedidos.' });
    }
};

exports.obterPedido = async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ sucesso: false, mensagem: 'ID do pedido inválido.' });
    }

    try {
        const pedidoResult = await pool.query(`
            SELECT
                p.id_pedido,
                p.data_pedido,
                pc.nome_pessoa AS nome_cliente,
                pf.nome_pessoa AS nome_funcionario,
                pg.valor_total_pagamento AS valor_total
            FROM public.pedido p
            LEFT JOIN public.pessoa pc
                ON pc.cpf_pessoa = p.cliente_pessoa_cpf_pessoa
            LEFT JOIN public.pessoa pf
                ON pf.cpf_pessoa = p.funcionario_pessoa_cpf_pessoa
            LEFT JOIN public.pagamento pg
                ON pg.pedido_id_pedido = p.id_pedido
            WHERE p.id_pedido = $1
        `, [id]);

        if (pedidoResult.rowCount === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado.' });
        }

        const produtosResult = await pool.query(`
            SELECT
                pr.nome_produto,
                php.quantidade,
                php.preco_unitario
            FROM public.pedido_has_produto php
            INNER JOIN public.produto pr
                ON pr.id_produto = php.produto_id_produto
            WHERE php.pedido_id_pedido = $1
            ORDER BY pr.nome_produto
        `, [id]);

        const pagamentosResult = await pool.query(`
            SELECT
                fp.nome_forma_pagamento,
                phfp.valor_pago
            FROM public.pagamento_has_forma_pagamento phfp
            INNER JOIN public.forma_pagamento fp
                ON fp.id_forma_pagamento = phfp.forma_pagamento_id_forma_pagamento
            WHERE phfp.pagamento_id_pedido = $1
            ORDER BY fp.nome_forma_pagamento
        `, [id]);

        const totalPago = pagamentosResult.rows.reduce(
            (total, pagamento) => total + Number(pagamento.valor_pago || 0),
            0
        );

        res.json({
            sucesso: true,
            pedido: {
                ...pedidoResult.rows[0],
                produtos: produtosResult.rows,
                pagamentos: pagamentosResult.rows,
                total_pago: Math.round(totalPago * 100) / 100
            }
        });
    } catch (error) {
        console.error('Erro ao obter pedido:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter detalhes do pedido.' });
    }
};
