
let inputs = document.querySelectorAll(".quant");/* salva qualquer os elementos que pertenção a class="quant"*/
                      /* querySelectorAll - pegue os elementos da class... */


inputs.forEach(input => {
/* inputs.forEach - elemento do inputs da class="quant" listado faça o parenteses...
input => { : para cada input listado percorra a chave*/
    
    input.addEventListener("keydown", function(e) {/*input.addEventListener - faça o evento descrito(listado), dentro do parenteses, acontecer no input
        "keydown" - quando alguma tecla for precionada(evento) acione...
        function(e) - execute o que estiver na função de acordo com o evento(e)*/

        if (
            !/[0-9]/.test(e.key) && 
            e.key !== "Backspace" &&
            e.key !== "Tab" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight"
        ) {
            e.preventDefault();
        /*.test(e.key) - teste se comando da tecla precionada(e.key) está obedecendo o critério...
        !/^[0-9]$/ - não(!) é um valor que estão no intervalo(/[]/) entre 0(inicio:^) e 9(final:$) e...
        if(e.key - se a chave/comando(key) da tecla precionada(e) não(!) for...
        e.preventDefault - faça bloquear o código(preventDefault), não executa o comando da tecla(e)  */ 
    }})
   
    input.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, "");
        /*input.addEventListener - faça o evento descrito(listado), dentro do parenteses, acontecer no input
        "input" - quando o valor de campo mudar(evento) acione...
        function() - execute o que estiver na função 
        this.value = :  valor atual do input é igual a ...
        this.value.replace - valor atual do input substituindo...
        /[^0-9]/g - remover todos(g-global) os caracteres que não(^) estão no intervalo(/[]/) entre 0 e 9...
        , "" - e substitua por vazio("")*/
    });
    });

function calcularCompra(){
    let lancheB = document.getElementById("lancheB").value;
    let lancheD = document.getElementById("lancheD").value;
    let Xsalada = document.getElementById("Xsalada").value;
    let refriML = document.getElementById("refriML").value;
    let refriL = document.getElementById("refriL").value;

    if(isNaN(lancheB)){
        lancheB = 0
    }
    if(isNaN(lancheD)){
        lancheD = 0
    }
    if(isNaN(Xsalada)){
        Xsalada = 0
    }
    if(isNaN(refriML)){
        refriML = 0
    }
    if(isNaN(refriL)){
        refriL = 0
    }
    let quant = (lancheB*1) + (lancheD*1) + (Xsalada*1) + (refriML*1) + (refriL*1);

    let total = (lancheB*22) + (lancheD*26) + (Xsalada*29) + (refriML*5) + (refriL*8);

    document.getElementById("resp").innerHTML = total.toFixed(2);
    document.getElementById("respQ").innerHTML = quant;
}