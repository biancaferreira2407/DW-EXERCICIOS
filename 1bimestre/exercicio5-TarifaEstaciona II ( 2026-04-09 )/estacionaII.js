function fcalc(){
    let h1 = new Date(document.getElementById("datahoraI").value);
    let hF = new Date(document.getElementById("datahoraF").value);
    let veiculo = document.getElementById("veiculo").value;
    let cliente = document.getElementById("cliente");
    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");
    
    let hora = Math.ceil((hF - h1)/(1000*60*60))

    let valorfixo = 5 + (2.5 * (hora - 1));

    let acressCarro = 1;
    let descClient = 1;

    if(hora>=24){
        let h24= parseInt(hora/24)
        if(hora%24===0){
            valorfixo = 60 * (hora/24)
        }else{

            valorfixo = (60 * (h24)) + (2.5 * h24 )
        } 
    }else{
        if(cliente.checked){
            descClient = 0.95;
        }

        if(veiculo === 'grande'){
            acressCarro = 1.25;
        }  
        
       
    }
    let valor = (valorfixo * acressCarro) * descClient;  
    

    if (hora === ""|| isNaN(hora) || hora<0) {
       footer.classList.add("erro")
        mensagem.innerHTML="a quantidade de horas estacionadas precisa ser preenchida por um número positivo"
        document.getElementById("hora").focus()
        document.getElementById("resp").innerHTML = "-"
    }else{
         footer.classList.remove("erro")
        mensagem.innerHTML="Calculo realizado com sucesso"
        document.getElementById("resp").innerHTML = valor.toFixed(2);
    }
}
