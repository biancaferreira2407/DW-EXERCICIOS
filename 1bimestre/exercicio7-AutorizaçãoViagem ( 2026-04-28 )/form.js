function validarFormulario() {
    let valido = true;

    function validarNome(idInput, idErro) {
        let input = document.getElementById(idInput);
        let erro = document.getElementById(idErro);
        let partes = input.value.trim().split(/\s+/);

        if (partes.length < 2) {
            erro.innerText = "Digite nome e sobrenome";
            input.classList.add("input-erro");
            valido = false;
        } else {
            erro.innerText = "";
            input.classList.remove("input-erro");
        }
    }

    validarNome("nomeA", "erroNomeA");
    validarNome("nomeR", "erroNomeR");

    function validarCidade(idInput, idErro) {
        let input = document.getElementById(idInput);
        let erro = document.getElementById(idErro);

        if (input.value.trim() === "") {
            erro.innerText = "Digite o nome de uma cidade";
            input.classList.add("input-erro");
            valido = false;
        } else {
            erro.innerText = "";
            input.classList.remove("input-erro");
        }
    }

    validarCidade("cidadeP", "erroCidadeP");
    validarCidade("cidadeD", "erroCidadeD");

    function validarCpf(idInput, idErro) {
        let input = document.getElementById(idInput);
        let erro = document.getElementById(idErro);
        let valor = input.value.trim();

        if (valor.length !== 11) {
            erro.innerText = "CPF deve ter 11 dígitos";
            input.classList.add("input-erro");
            valido = false;
        } else {
            erro.innerText = "";
            input.classList.remove("input-erro");
        }
    }

    validarCpf("cpfA", "erroCpfA");

    let idadeInput = document.getElementById("idade");
    let idade = parseInt(idadeInput.value);
    let erroIdade = document.getElementById("erroIdade");

    if (isNaN(idade) || idade < 7 || idade > 18) {
        erroIdade.innerText = "Idade deve ser entre 7 e 18";
        idadeInput.classList.add("input-erro");
        valido = false;
    } else {
        erroIdade.innerText = "";
        idadeInput.classList.remove("input-erro");
    }

    return valido;
}

/* BLOQUEIOS E FORMATAÇÕES */

document.getElementById("idade").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 2);

    let idade = parseInt(this.value);
    let categoria = "";

    if (isNaN(idade) || idade < 7 || idade > 18) {
        categoria = "Idade Inválida";
    } else if (idade >= 14) {
        categoria = "Adolescente";
    } else if (idade >= 12) {
        categoria = "Pré-Adolescente";
    } else {
        categoria = "Infantil";
    }

    document.getElementById("categoriaExibida").value = categoria;
    document.getElementById("categoria").value = categoria;
});

document.getElementById("cpfA").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 11);
});

/* FORMATAÇÃO DE NOME */
function capitalizar(valor) {
    return valor
        .toLowerCase()
        .replace(/\b\w/g, letra => letra.toUpperCase());
}

function formatarTexto(id) {
    document.getElementById(id).addEventListener("input", function () {
        let valor = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        this.value = capitalizar(valor);
    });
}

formatarTexto("nomeA");
formatarTexto("nomeR");
formatarTexto("cidadeP");
formatarTexto("cidadeD");