
        window.onload = function () {
            const urlParams = new URLSearchParams(window.location.search);
            const cpf = urlParams.get('cpfA');
            // Atribuição semântica dos dados capturados
            document.getElementById('resNomeA').textContent = urlParams.get('nomeA');
            document.getElementById('resNomeR').textContent = urlParams.get('nomeR');
            document.getElementById('resCpfA').textContent = formatarCPF(cpf);
            document.getElementById('resIdade').textContent = urlParams.get('idade');
            document.getElementById('resModal').textContent = urlParams.get('modal');
            document.getElementById('resCidadeP').textContent = urlParams.get('cidadeP');
            document.getElementById('resCidadeD').textContent = urlParams.get('cidadeD');
            document.getElementById('resCategoria').textContent = urlParams.get('categoria');

        }

        function formatarCPF(cpf) {
            cpf = cpf.replace(/\D/g, ''); // remove tudo que não é número
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
                '$1.$2.$3-$4'
            );
        }

        const canvas = document.getElementById("assinatura");
        const ctx = canvas.getContext("2d");

        let desenhando = false;

        canvas.addEventListener("mousedown", () => desenhando = true);
        canvas.addEventListener("mouseup", () => {
            desenhando = false;
            ctx.beginPath();
        });

        canvas.addEventListener("mousemove", function (e) {
            if (!desenhando) return;

            ctx.lineWidth = 2;
            ctx.lineCap = "round";

            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });

        function limpar() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function confirmar() {
            // pega a assinatura como imagem
            const imagem = canvas.toDataURL();

            // coloca na área final
            document.getElementById("imgAssinatura").src = imagem;

            // esconde área de desenho
            document.getElementById("areaAssinatura").style.display = "none";

            // mostra assinatura final
            document.getElementById("assinaturaFinal").style.display = "block";
        }