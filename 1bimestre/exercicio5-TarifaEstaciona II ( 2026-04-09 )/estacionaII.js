function fcalc(){
    let h1 = new Date(document.getElementById("datahoraI").value);
    let hF = new Date(document.getElementById("datahoraF").value);
    let veiculo = document.getElementById("veiculo");
    let cliente = document.getElementById("cliente");
    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");
     
    if(h1>hF){
        footer.classList.add("erro")
        mensagem.innerHTML="data e hora de saída tem que ser depois da data e hora de entrada"
        document.getElementById("datahoraF").focus()
        document.getElementById("resp").innerHTML = "-";
        document.getElementById("respH").innerHTML = "-";
        return
    }

    let horas = (hF - h1)/(1000*60*60);


    let decimal = horas - Math.floor(horas)
    let hora;
    if(decimal < 0.2){
        hora = Math.floor(horas)
    }else{
        hora = Math.ceil(horas)
    }
    if(hora <= 0){
        hora = 1;
    }

    let valorfixo = 5 + (2.5 * (hora - 1));

    if(hora>=24){
        let h24 = Math.floor(hora/24)
        if(hora%24===0){
            valorfixo = 60 * (hora/24)
        }else{
            let resto = hora % 24;
            valorfixo = (60 * h24) + (5 + (2.5 * (resto - 1)));
        } 
    }


    let acressCarro = 1;
    let descClient = 1;
    if(cliente.checked){
        descClient = 0.95;
    }

    if(veiculo.checked){            
        acressCarro = 1.25;
    }  
        
    
    let valor = (valorfixo * acressCarro) * descClient;  

   
    footer.classList.remove("erro")
    mensagem.innerHTML="Calculo realizado com sucesso"
    document.getElementById("respH").innerHTML = hora + " hora(s)";
    document.getElementById("resp").innerHTML = valor.toFixed(2);
    
}
