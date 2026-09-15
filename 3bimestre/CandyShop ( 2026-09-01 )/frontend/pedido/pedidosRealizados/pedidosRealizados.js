const URL_API = 'http://localhost:3001';

let pedidos = [];

const pedidosTableBody = document.getElementById('pedidosTableBody');
const buscar = document.getElementById('buscar');
const modalDetalhes = document.getElementById('modalDetalhes');
const detalhesPedido = document.getElementById('detalhesPedido');
const tituloDetalhes = document.getElementById('tituloDetalhes');

window.addEventListener('DOMContentLoaded', carregarPedidos);
buscar.addEventListener('input', filtrarPedidos);
document.getElementById('btnLimpar').addEventListener('click', () => {
    buscar.value = '';
    renderizarTabela(pedidos);
});
document.getElementById('btnFecharModal').addEventListener('click', fecharModal);
modalDetalhes.addEventListener('click', (evento) => {
    if (evento.target === modalDetalhes) fecharModal();
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharModal();
});

async function carregarPedidos() {
    try {
        const resposta = await fetch(`${URL_API}/pedido`);
        const data = await resposta.json();

        if (!resposta.ok || !data.sucesso) {
            throw new Error(data.mensagem || 'Erro ao carregar pedidos.');
        }

        pedidos = Array.isArray(data.pedidos) ? data.pedidos : [];
        renderizarTabela(pedidos);
    } catch (erro) {
        console.error('Erro ao carregar pedidos:', erro);
        pedidosTableBody.innerHTML = '<tr><td colspan="6" class="mensagem-vazia">Servidor offline ou erro ao carregar os pedidos.</td></tr>';
    }
}

function renderizarTabela(lista) {
    pedidosTableBody.innerHTML = '';

    if (lista.length === 0) {
        pedidosTableBody.innerHTML = '<tr><td colspan="6" class="mensagem-vazia">Nenhum pedido encontrado.</td></tr>';
        return;
    }

    lista.forEach((pedido) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id_pedido}</td>
            <td>${formatarData(pedido.data_pedido)}</td>
            <td>${escapeHtml(pedido.nome_cliente || 'Sem cliente')}</td>
            <td>${escapeHtml(pedido.nome_funcionario || 'Não informado')}</td>
            <td>${formatarMoeda(pedido.valor_total)}</td>
            <td>
                <button type="button" class="btn-visualizar" onclick="visualizarPedido(${pedido.id_pedido})">👁 Visualizar</button>
            </td>
        `;
        pedidosTableBody.appendChild(row);
    });
}

function filtrarPedidos() {
    const termo = normalizar(buscar.value.trim());

    if (!termo) {
        renderizarTabela(pedidos);
        return;
    }

    const filtrados = pedidos.filter((pedido) => {
        const texto = [
            pedido.id_pedido,
            pedido.data_pedido,
            formatarData(pedido.data_pedido),
            pedido.nome_cliente || '',
            pedido.nome_funcionario || '',
            pedido.valor_total
        ].join(' ');

        return normalizar(texto).includes(termo);
    });

    renderizarTabela(filtrados);
}

async function visualizarPedido(id) {
    try {
        detalhesPedido.innerHTML = '<p>Carregando detalhes...</p>';
        modalDetalhes.classList.add('aberto');
        modalDetalhes.setAttribute('aria-hidden', 'false');

        const resposta = await fetch(`${URL_API}/pedido/${id}`);
        const data = await resposta.json();

        if (!resposta.ok || !data.sucesso) {
            throw new Error(data.mensagem || 'Não foi possível carregar os detalhes.');
        }

        const pedido = data.pedido;
        tituloDetalhes.textContent = `Pedido #${pedido.id_pedido}`;

        const produtosHtml = pedido.produtos.length
            ? pedido.produtos.map(item => `
                <tr>
                    <td>${escapeHtml(item.nome_produto)}</td>
                    <td>${item.quantidade}</td>
                    <td>${formatarMoeda(item.preco_unitario)}</td>
                    <td>${formatarMoeda(Number(item.quantidade) * Number(item.preco_unitario))}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="4" class="mensagem-vazia">Nenhum produto.</td></tr>';

        const pagamentosHtml = pedido.pagamentos.length
            ? pedido.pagamentos.map(item => `
                <tr>
                    <td>${escapeHtml(item.nome_forma_pagamento)}</td>
                    <td>${formatarMoeda(item.valor_pago)}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="2" class="mensagem-vazia">Nenhum pagamento.</td></tr>';

        detalhesPedido.innerHTML = `
            <div class="dados-detalhes">
                <div class="dado"><strong>Cliente:</strong> ${escapeHtml(pedido.nome_cliente || 'Sem cliente')}</div>
                <div class="dado"><strong>Funcionário:</strong> ${escapeHtml(pedido.nome_funcionario || 'Não informado')}</div>
                <div class="dado"><strong>Data:</strong> ${formatarData(pedido.data_pedido)}</div>
                <div class="dado"><strong>Total:</strong> ${formatarMoeda(pedido.valor_total)}</div>
            </div>

            <div class="bloco-detalhes">
                <h3>Produtos</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço unitário</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>${produtosHtml}</tbody>
                    </table>
                </div>
                <div class="resumo-total"><strong>Total do pedido:</strong> ${formatarMoeda(pedido.valor_total)}</div>
            </div>

            <div class="bloco-detalhes">
                <h3>Pagamento</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Forma de pagamento</th>
                                <th>Valor pago</th>
                            </tr>
                        </thead>
                        <tbody>${pagamentosHtml}</tbody>
                    </table>
                </div>
                <div class="resumo-total"><strong>Total pago:</strong> ${formatarMoeda(pedido.total_pago)}</div>
            </div>
        `;
    } catch (erro) {
        console.error('Erro ao visualizar pedido:', erro);
        detalhesPedido.innerHTML = `<p>Erro: ${escapeHtml(erro.message)}</p>`;
    }
}

function fecharModal() {
    modalDetalhes.classList.remove('aberto');
    modalDetalhes.setAttribute('aria-hidden', 'true');
}

function formatarData(data) {
    if (!data) return '-';
    const valor = String(data).slice(0, 10);
    const partes = valor.split('-');
    if (partes.length !== 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function normalizar(texto) {
    return String(texto ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function escapeHtml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

window.visualizarPedido = visualizarPedido;
