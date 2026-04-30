
        function validarFormulario() {

            let valido = true;

            // ===== NOME ATLETA =====
            let nomeA = document.getElementById("nomeA");
            let erroNomeA = document.getElementById("erroNomeA");
            let partesA = nomeA.value.trim().split(/\s+/);

            if (partesA.length < 2 || partesA[0].length < 2 || partesA[1].length < 2) {
                erroNomeA.innerText = "Digite nome e sobrenome";
                nomeA.classList.add("input-erro");
                valido = false;
            } else {
                erroNomeA.innerText = "";
                nomeA.classList.remove("input-erro");
            }

            // ===== NOME RESPONSÁVEL =====
            let nomeR = document.getElementById("nomeR");
            let erroNomeR = document.getElementById("erroNomeR");
            let partesR = nomeR.value.trim().split(/\s+/);

            if (partesR.length < 2 || partesR[0].length < 2 || partesR[1].length < 2) {
                erroNomeR.innerText = "Digite nome e sobrenome";
                nomeR.classList.add("input-erro");
                valido = false;
            } else {
                erroNomeR.innerText = "";
                nomeR.classList.remove("input-erro");
            }

            // ===== IDADE =====
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

            // ===== CATEGORIA =====
            if (valido) {
                let categoria;

                if (idade >= 14) {
                    categoria = "Adolescente";
                } else if (idade >= 12) {
                    categoria = "Pré-Adolescente";
                } else {
                    categoria = "Infantil";
                }

                document.getElementById("categoria").value = categoria;
            }

            return valido;
        }

        // ===== BLOQUEIOS =====

        // idade só número
        document.getElementById("idade").addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 2);
        });

        // CPF só número (até 11)
        document.getElementById("cpfA").addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 11);
        });

        // nomes só letras
        function bloquearLetras(id) {
            document.getElementById(id).addEventListener("input", function () {
                this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
            });
        }

        bloquearLetras("nomeA");
        bloquearLetras("nomeR");
        bloquearLetras("cidadeP");
        bloquearLetras("cidadeD");