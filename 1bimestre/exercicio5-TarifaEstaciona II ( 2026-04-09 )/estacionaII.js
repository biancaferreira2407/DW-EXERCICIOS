function fcalc(){
    /* salvar inputs html */
    let dataI = document.getElementById("datahoraI").value
    let dataF = document.getElementById("datahoraF").value
    let h1 = new Date(dataI);
    let hF = new Date(dataF);
    let veiculo = document.getElementById("veiculo");
    let cliente = document.getElementById("cliente");
    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");
     
    /* verificar erro de dataI > dataF */
    if(h1>hF){
        footer.classList.add("erro")
        mensagem.innerHTML="data e hora de saída tem que ser depois da data e hora de entrada"
        document.getElementById("datahoraF").focus()
        document.getElementById("resp").innerHTML = "-";
        document.getElementById("respH").innerHTML = "-";
        return
    }
    if(dataF==="" || dataI===""){
        footer.classList.add("erro")
        mensagem.innerHTML="informe as datas de entrada e saída"
        document.getElementById("datahoraF").focus()
        document.getElementById("resp").innerHTML = "-";
        document.getElementById("respH").innerHTML = "-";
        return
    }


    let horas = (hF - h1)/(1000*60*60);    /* tansforma dataI e dataF em horas */


    /* se a quantidade de horas for quebrada, apartir de 20 min arredonda para cima( 1h a mais) */
    let decimal_min = horas - Math.floor(horas)
    let hora;
    if(decimal_min < 0.2){
        hora = Math.floor(horas)
    }else{
        hora = Math.ceil(horas)
    }
    
    if(hora <= 0){
        hora = 1;
    }

   

    /* horas maiores que 24 */
    if(hora>=24){
        let h24 = Math.floor(hora/24)
        if(hora%24===0){
            valorfixo = 60 * (hora/24)
        }else{
            let resto = hora % 24;
            valorfixo = (60 * h24) +(2.5 * resto );
        } 
    }
 
    let valorfixo = 5 + (2.5 * (hora - 1));    /* valor que será usado para o denconto ou acréssimo */


    /*calculo de acréssimo ou desconto*/
    let acressCarro = 1;
    let descClient = 1;
    if(cliente.checked){
        descClient = 0.95;
    }

    if(veiculo.checked){            
        acressCarro = 1.25;
    }  
        
    
    let valor = (valorfixo * acressCarro) * descClient;  /* calculo final da tarifa */

   
    footer.classList.remove("erro")
    mensagem.innerHTML="Calculo realizado com sucesso"
    document.getElementById("respH").innerHTML = hora + " hora(s)";
    document.getElementById("resp").innerHTML = valor.toFixed(2);
    
}
