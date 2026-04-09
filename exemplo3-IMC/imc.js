function fcalc(){
    let erro = document.getElementById("messagem");
    let footer = document.getElementById("footer");
    let peso = parseFloat(document.getElementById("peso").value)
    let altura = parseFloat(document.getElementById("altura").value)
    let imc = peso / (altura * altura)
    let classificacao="";
    
    if (imc < 18.5) {
        classificacao = "Abaixo do peso";
        
    } else if (imc >= 18.5 && imc <= 24.9) {
        classificacao = "Peso normal";
        
    } else if (imc >= 25.0 && imc <= 29.9) {
        classificacao = "Sobrepeso";
       
    } else if (imc >= 30.0 && imc <= 34.9) {
        classificacao = "Obesidade grau I";
       
    } else if (imc >= 35.0 && imc <= 39.9) {
        classificacao = "Obesidade grau II";
        
    } else {
        classificacao = "Obesidade grau III";
       
    }
    if (!peso || !altura) {
        footer.classList.add("erro");
        erro.innerHTML = "Preencha todos os campos!";
        document.getElementById("respIMC").innerHTML="-"
        document.getElementById("respCLASS").innerHTML="-"
        return;
    }else if(peso<0 || peso >300){
       footer.classList.add("erro");
        erro.innerHTML = "Peso tem que ser um número maior que zero válido";
        document.getElementById("peso").focus()
        document.getElementById("respIMC").innerHTML="-"
           document.getElementById("respCLASS").innerHTML="-"
    }else if(altura<0.60 || altura>3){
         footer.classList.add("erro");
        erro.innerHTML = "Altura tem que ser um número maior que zero válido";
        document.getElementById("altura").focus()
        document.getElementById("respIMC").innerHTML="-"
           document.getElementById("respCLASS").innerHTML="-"
    }else{
        
        footer.classList.remove("erro");
        erro.innerHTML = "Cálculo realizado com sucesso";
        document.getElementById("respIMC").innerHTML=imc.toFixed(2)
        document.getElementById("respCLASS").innerHTML=classificacao
    }
    

    }