let listaFilme = []; 
let oQueEstaFazendo = ''; 
let filme = null; 
bloquearAtributos(true);

function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaFilme.length; i++) {
        const filme = listaFilme[i];
        if (filme.id == chave) {
            filme.posicaoNaLista = i;
            return listaFilme[i];
        }
    }
    return null;
}


function procure() {
    const id = document.getElementById("inputId").value;
    if (isNaN(id) || !Number.isInteger(Number(id))) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputId").focus();
        return;
    }

    if (id) { 
        filme = procurePorChavePrimaria(id);
        if (filme) { 
            mostrarDadosFilme(filme);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); 
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { 
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("inputId").focus();
        return;
    }
}


function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputId").focus();

}


function alterar() {

    
    bloquearAtributos(false);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}


function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    

    

    let id;
    if (filme == null) {
        id = parseInt(document.getElementById("inputId").value);
    } else {
        id = filme.id;
    }

    const titulo = document.getElementById("inputTitulo").value;
    const diretor = document.getElementById("inputDiretor").value;
    const dataLancamento = document.getElementById("inputDataLancamento").value;
    const avaliacao = parseFloat(document.getElementById("inputAvaliacao").value);
    
    if (id && titulo && diretor && dataLancamento && avaliacao) {
        switch (oQueEstaFazendo) {
            case 'inserindo':
                filme = new Filme(id, titulo, diretor, dataLancamento, avaliacao);
                listaFilme.push(filme);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                filmeAlterado = new Filme(id, titulo, diretor, dataLancamento, avaliacao);
                listaFilme[filme.posicaoNaLista] = filmeAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaFilme.length; i++) {
                    if (filme.posicaoNaLista != i) {
                        novaLista.push(listaFilme[i]);
                    }
                }
                listaFilme = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputId").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}


function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto +=
            linha.id + " - " +
            linha.titulo + " - " +
            linha.diretor + " - " +
            linha.dataLancamento + " - " +
            linha.avaliacao + "<br>";
    }
    return texto;
}


function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaFilme);
}

function filtrarPorAvaliacao() {
    let acimaDeOito = [];
    for (let i = 0; i < listaFilme.length; i++) {
        let f = listaFilme[i];
        if (f.avaliacao >= 8) {
            acimaDeOito.push(f);
        }

    }
    document.getElementById("outputSaida").innerHTML =
        preparaListagem(acimaDeOito);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    
    document.getElementById("divAviso").innerHTML = mensagem;
}


function mostrarDadosFilme(filme) {
    document.getElementById("inputId").value = filme.id;
    document.getElementById("inputTitulo").value = filme.titulo;
    document.getElementById("inputDiretor").value = filme.diretor;
    document.getElementById("inputDataLancamento").value = filme.dataLancamento;
    document.getElementById("inputAvaliacao").value = filme.avaliacao;

    
    bloquearAtributos(true);
}


function limparAtributos() {
    document.getElementById("inputTitulo").value = "";
    document.getElementById("inputDiretor").value = "";
    document.getElementById("inputDataLancamento").value = "";
    document.getElementById("inputAvaliacao").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    
    document.getElementById("inputId").readOnly = !soLeitura;
    document.getElementById("inputTitulo").readOnly = soLeitura;
    document.getElementById("inputDiretor").readOnly = soLeitura;
    document.getElementById("inputDataLancamento").readOnly = soLeitura;
    document.getElementById("inputAvaliacao").readOnly = soLeitura;
 
}


function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    
    
    

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; 
    document.getElementById("inputId").focus();
}

function persistirEmLocalPermanente(arquivoDestino, conteudo) {
    
    const blob = new Blob([conteudo], { type: 'text/plain' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = arquivoDestino; 
    link.click(); 
    
    URL.revokeObjectURL(link.href); 
}



function abrirArquivoSalvoEmLocalPermanente() {

    const input = document.createElement('input');
    
    input.type = 'file';
    input.accept = '.csv'; 
    input.onchange = function (event) {
        
        const arquivo = event.target.files[0]; 
        console.log(arquivo.name);
        if (arquivo) {
            converterDeCSVparaListaObjeto(arquivo);
        }
        
    };
    input.click(); 
}

function prepararESalvarCSV() { 
    let nomeDoArquivoDestino = "./Filme.csv";  
    let textoCSV = "";
    let fimDeLinha = "\n";
    for (let i = 0; i < listaFilme.length; i++) {
        const linha = listaFilme[i]; 
        if (i == listaFilme.length - 1) {
            fimDeLinha = "";
        }
        textoCSV += linha.id + ";" +
            linha.titulo + ";" +
            linha.diretor + ";" +
            linha.dataLancamento + ";" +
            linha.avaliacao + fimDeLinha;
    }

    persistirEmLocalPermanente(nomeDoArquivoDestino, textoCSV);
}





function converterDeCSVparaListaObjeto(arquivo) {
    const leitor = new FileReader();  
    leitor.onload = function (e) {
        const conteudo = e.target.result; 
        const linhas = conteudo.split('\n'); 
        listaFilme = []; 
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();  
            if (linha) { 
                const dados = linha.split(';'); 
                if (dados.length === 5) { 
                    
                    listaFilme.push({
                        id: dados[0],
                        titulo: dados[1],
                        diretor: dados[2],
                        dataLancamento: dados[3],
                        avaliacao: dados[4]
                    });
                }
            }
        }
        listar(); 
    };
    leitor.readAsText(arquivo); 
}

