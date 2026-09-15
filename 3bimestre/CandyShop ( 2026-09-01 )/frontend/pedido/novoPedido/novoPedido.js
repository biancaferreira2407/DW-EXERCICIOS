const API_BASE_URL = 'http://localhost:3001';

let produtos = [];
let formasPagamento = [];
let itensPedido = [];

const idPedido = document.getElementById('id_pedido');
const dataPedido = document.getElementById('data_pedido');
const clienteSelect = document.getElementById('cliente_pessoa_cpf_pessoa');
const funcionarioSelect = document.getElementById('funcionario_pessoa_cpf_pessoa');
const produtoSelect = document.getElementById('produto_id_produto');
const quantidadeInput = document.getElementById('quantidade_produto');
const produtosTableBody = document.getElementById('produtosTableBody');
const valorTotalPedido = document.getElementById('valorTotalPedido');
const resumoTotalPedido = document.getElementById('resumoTotalPedido');
const totalPago = document.getElementById('totalPago');
const valorRestante = document.getElementById('valorRestante');
const pagamentosContainer = document.getElementById('pagamentosContainer');
const messageContainer = document.getElementById('messageContainer');

window.addEventListener('DOMContentLoaded', inicializar);

document.getElementById('btnAdicionarProduto').addEventListener('click', adicionarProduto);
document.getElementById('btnAdicionarPagamento').addEventListener('click', adicionarPagamento);
document.getElementById('btnSalvar').addEventListener('click', salvarPedido);
document.getElementById('btnCancelar').addEventListener('click', cancelarPedido);

async function inicializar() {
    const hoje = new Date();
    dataPedido.value = hoje.toISOString().split('T')[0];

    try {
        await Promise.all([
            carregarProdutos(),
            carregarClientes(),
            carregarFuncionarios(),
            carregarFormasPagamento()
        ]);
    } catch (erro) {
        console.error(erro);
        mostrarMensagem('Não foi possível carregar todos os dados do pedido.', 'error');
    }

    atualizarTotais();
}

function mostrarMensagem(texto, tipo = 'info') {
    messageContainer.innerHTML = `<div class="message ${tipo}">${texto}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3500);
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

async function carregarProdutos() {
    const response = await fetch(`${API_BASE_URL}/produto/listar`);
    const data = await response.json();

    if (!response.ok || !data.sucesso) {
        throw new Error(data.mensagem || 'Erro ao carregar produtos.');
    }

    produtos = data.produtos;
    produtoSelect.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id_produto;
        option.textContent = `${produto.nome_produto} — ${formatarMoeda(produto.preco_unitario_produto)} — estoque: ${produto.quantidade_estoque_produto}`;
        produtoSelect.appendChild(option);
    });
}

async function carregarClientes() {
    const response = await fetch(`${API_BASE_URL}/cliente`);
    const data = await response.json();

    const clientes = Array.isArray(data) ? data : (data.clientes || []);
    clienteSelect.innerHTML = '<option value="">Sem cliente cadastrado</option>';

    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.pessoa_cpf_pessoa;
        option.textContent = `${cliente.nome_pessoa || cliente.pessoa_cpf_pessoa} — CPF: ${cliente.pessoa_cpf_pessoa}`;
        clienteSelect.appendChild(option);
    });
}

async function carregarFuncionarios() {
    const response = await fetch(`${API_BASE_URL}/funcionario`);
    const data = await response.json();

    const funcionarios = data.funcionarios || [];
    funcionarioSelect.innerHTML = '<option value="">Selecione o funcionário</option>';

    funcionarios.forEach(funcionario => {
        const option = document.createElement('option');
        option.value = funcionario.pessoa_cpf_pessoa;
        option.textContent = `${funcionario.nome_pessoa || funcionario.pessoa_cpf_pessoa} — CPF: ${funcionario.pessoa_cpf_pessoa}`;
        funcionarioSelect.appendChild(option);
    });
}

async function carregarFormasPagamento() {
    const response = await fetch(`${API_BASE_URL}/forma_pagamento/listar`);
    const data = await response.json();

    if (!response.ok || !data.sucesso) {
        throw new Error(data.mensagem || 'Erro ao carregar formas de pagamento.');
    }

    formasPagamento = data.forma_pagamentos || [];
    preencherSelectFormaPagamento(pagamentosContainer.querySelector('.forma-pagamento'));
}

function preencherSelectFormaPagamento(select) {
    select.innerHTML = '<option value="">Selecione</option>';

    formasPagamento.forEach(forma => {
        const option = document.createElement('option');
        option.value = forma.id_forma_pagamento;
        option.textContent = forma.nome_forma_pagamento;
        select.appendChild(option);
    });
}

function adicionarProduto() {
    const produtoId = Number(produtoSelect.value);
    const quantidade = Number(quantidadeInput.value);

    if (!produtoId) {
        mostrarMensagem('Selecione um produto.', 'info');
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        mostrarMensagem('Informe uma quantidade válida.', 'warning');
        return;
    }

    const produto = produtos.find(p => Number(p.id_produto) === produtoId);
    if (!produto) {
        mostrarMensagem('Produto não encontrado.', 'error');
        return;
    }

    const itemExistente = itensPedido.find(item => item.id_produto === produtoId);
    const novaQuantidade = itemExistente ? itemExistente.quantidade + quantidade : quantidade;

    if (novaQuantidade > Number(produto.quantidade_estoque_produto)) {
        mostrarMensagem(`Estoque insuficiente. Disponível: ${produto.quantidade_estoque_produto}.`, 'warning');
        return;
    }

    if (itemExistente) {
        itemExistente.quantidade = novaQuantidade;
    } else {
        itensPedido.push({
            id_produto: produtoId,
            nome_produto: produto.nome_produto,
            quantidade,
            preco_unitario: Number(produto.preco_unitario_produto)
        });
    }

    produtoSelect.value = '';
    quantidadeInput.value = 1;
    renderizarProdutos();
    atualizarTotais();
}

function removerProduto(idProduto) {
    itensPedido = itensPedido.filter(item => item.id_produto !== idProduto);
    renderizarProdutos();
    atualizarTotais();
}

function renderizarProdutos() {
    produtosTableBody.innerHTML = '';

    if (itensPedido.length === 0) {
        produtosTableBody.innerHTML = '<tr><td colspan="5">Nenhum produto adicionado ao pedido.</td></tr>';
        return;
    }

    itensPedido.forEach(item => {
        const subtotal = item.quantidade * item.preco_unitario;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.nome_produto}</td>
            <td>${item.quantidade}</td>
            <td>${formatarMoeda(item.preco_unitario)}</td>
            <td>${formatarMoeda(subtotal)}</td>
            <td>
                <button type="button" class="btn-danger btn-remover-produto">Remover</button>
            </td>
        `;

        row.querySelector('.btn-remover-produto').addEventListener('click', () => {
            removerProduto(item.id_produto);
        });

        produtosTableBody.appendChild(row);
    });
}

function calcularTotalPedido() {
    return itensPedido.reduce((total, item) => {
        return total + (item.quantidade * item.preco_unitario);
    }, 0);
}

function obterPagamentos() {
    return [...pagamentosContainer.querySelectorAll('.pagamento-item')].map(item => ({
        forma_pagamento_id_forma_pagamento: Number(item.querySelector('.forma-pagamento').value),
        valor_pago: Number(item.querySelector('.valor-pago').value) || 0
    })).filter(pagamento => pagamento.forma_pagamento_id_forma_pagamento && pagamento.valor_pago > 0);
}

function atualizarTotais() {
    const total = calcularTotalPedido();
    const pago = obterPagamentos().reduce((soma, pagamento) => soma + pagamento.valor_pago, 0);
    const restante = total - pago;

    valorTotalPedido.textContent = formatarMoeda(total);
    resumoTotalPedido.textContent = formatarMoeda(total);
    totalPago.textContent = formatarMoeda(pago);
    valorRestante.textContent = formatarMoeda(Math.max(restante, 0));
}

function adicionarPagamento() {
    const pagamento = document.createElement('div');
    pagamento.className = 'pagamento-item';

    pagamento.innerHTML = `
        <div class="form-group">
            <label>Forma de pagamento:</label>
            <select class="forma-pagamento"></select>
        </div>
        <div class="form-group">
            <label>Valor pago:</label>
            <input type="number" class="valor-pago" min="0.01" step="0.01" placeholder="0,00">
        </div>
        <button type="button" class="btn-danger btn-remover-pagamento">Remover</button>
    `;

    preencherSelectFormaPagamento(pagamento.querySelector('.forma-pagamento'));
    pagamentosContainer.appendChild(pagamento);

    pagamento.querySelector('.valor-pago').addEventListener('input', atualizarTotais);
    pagamento.querySelector('.forma-pagamento').addEventListener('change', atualizarTotais);
    pagamento.querySelector('.btn-remover-pagamento').addEventListener('click', () => {
        pagamento.remove();
        atualizarTotais();
    });

    atualizarTotais();
}

pagamentosContainer.querySelector('.valor-pago').addEventListener('input', atualizarTotais);
pagamentosContainer.querySelector('.forma-pagamento').addEventListener('change', atualizarTotais);

async function salvarPedido() {
    const total = calcularTotalPedido();
    const pagamentos = obterPagamentos();
    const totalPagoValor = pagamentos.reduce((soma, pagamento) => soma + pagamento.valor_pago, 0);

    if (!dataPedido.value) {
        mostrarMensagem('Informe a data do pedido.', 'warning');
        return;
    }

    if (itensPedido.length === 0) {
        mostrarMensagem('Adicione pelo menos um produto ao pedido.', 'warning');
        return;
    }

    if (pagamentos.length === 0) {
        mostrarMensagem('Informe pelo menos uma forma de pagamento.', 'warning');
        return;
    }

    if (Math.abs(totalPagoValor - total) > 0.009) {
        mostrarMensagem(`O pagamento precisa totalizar ${formatarMoeda(total)}.`, 'warning');
        return;
    }

    const dadosPedido = {
        data_pedido: dataPedido.value,
        cliente_pessoa_cpf_pessoa: clienteSelect.value || null,
        funcionario_pessoa_cpf_pessoa: funcionarioSelect.value || null,
        produtos: itensPedido.map(item => ({
            produto_id_produto: item.id_produto,
            quantidade: item.quantidade
        })),
        pagamentos
    };

    const btnSalvar = document.getElementById('btnSalvar');
    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Salvando...';

    try {
        const response = await fetch(`${API_BASE_URL}/pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPedido)
        });

        const data = await response.json();

        if (!response.ok || !data.sucesso) {
            throw new Error(data.mensagem || 'Erro ao salvar pedido.');
        }

        idPedido.value = data.pedido.id_pedido;
        mostrarMensagem(`Pedido #${data.pedido.id_pedido} salvo com sucesso!`, 'success');

        setTimeout(() => {
            window.location.href = '../pedidosRealizados/pedidosRealizados.html';
        }, 1200);
    } catch (erro) {
        console.error('Erro ao salvar pedido:', erro);
        mostrarMensagem(erro.message || 'Erro ao salvar pedido.', 'error');
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = 'Salvar pedido';
    }
}

function cancelarPedido() {
    if (itensPedido.length > 0) {
        const confirmou = confirm('Cancelar o pedido? Os dados preenchidos serão perdidos.');
        if (!confirmou) return;
    }

    window.location.href = '../../menu/menu.html';
}

renderizarProdutos();
