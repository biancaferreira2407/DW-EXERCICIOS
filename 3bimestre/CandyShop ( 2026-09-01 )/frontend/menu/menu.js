const URL_API = 'http://localhost:3001';

// Verifica a conexão com o servidor backend ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const resposta = await fetch(`${URL_API}/produto/listar`);
        if (resposta.ok) {
            console.log('Servidor backend conectado com sucesso!');
        }
    } catch (erro) {
        console.warn('Aviso: Não foi possível conectar ao servidor backend em ' + URL_API);
    }
});


const btnPedidos = document.getElementById('btnPedidos');
const submenuPedidos = document.getElementById('submenuPedidos');

if (btnPedidos && submenuPedidos) {
    btnPedidos.addEventListener('click', () => {
        submenuPedidos.classList.toggle('aberto');
        btnPedidos.classList.toggle('aberto');
    });
}
