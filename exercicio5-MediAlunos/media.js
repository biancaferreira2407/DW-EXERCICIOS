function fcalc(){
    let ra = document.getElementById("RA").value
    let nom = document.getElementById("nome").value
    let me = parseFloat(document.getElementById("me").value)
    let i = parseFloat(document.getElementById("i").value)
    let ii = parseFloat(document.getElementById("ii").value)
    let iii = parseFloat(document.getElementById("iii").value)
    let iv = parseFloat(document.getElementById("iv").value)
    let media = (i + ii * 2 + iii * 3 + iv * 4 + me )/11
    let conceito="";
    let s=""

    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");
    if(media>=9){
        conceito="A"
        s="aprovado"
    }else if(media>=7.5){
        conceito="B"
        s="aprovado"

    }else if(media>=6){
        conceito="C"
        s="aprovado"

    }else if(media>=4){
        conceito="D"
        s="reprovado"

    }else{
        conceito="E"
        s="reprovado"
    }

    if (i<0 || i>10 || ii<0 || ii>10 || iii<0 || iii>10 || iv<0 || iv>10 || me<0 || me>10) {
        footer.classList.add("erro");
        mensagem.innerHTML = "todas as notas precisam ser entre 0 e 10";
        fnotanegativa(i,ii,iii,iv,me)
        document.getElementById("spanRA").innerHTML= "-"
        document.getElementById("spanNom").innerHTML= "-"
        document.getElementById("spanME").innerHTML= "-"
        document.getElementById("spanNotas").innerHTML= "-"
        document.getElementById("spanC").innerHTML= "-"
        document.getElementById("spanS").innerHTML= "-"
        document.getElementById("spanMed").innerHTML= "-"
    } else if( ra.length !== 7 || isNaN(ra)){
        footer.classList.add("erro");
        mensagem.innerHTML = "ra precisa ter 7 digitos";
         document.getElementById("RA").focus()
        document.getElementById("spanRA").innerHTML= "-"
        document.getElementById("spanNom").innerHTML= "-"
        document.getElementById("spanME").innerHTML= "-"
        document.getElementById("spanNotas").innerHTML= "-"
        document.getElementById("spanC").innerHTML= "-"
        document.getElementById("spanS").innerHTML= "-"
        document.getElementById("spanMed").innerHTML= "-"
    } else if(fnome(nom)===1){
         footer.classList.add("erro");
        mensagem.innerHTML = "nome tem que estar completo - nome e sobrenome";
        document.getElementById("nome").focus()
        document.getElementById("spanRA").innerHTML= "-"
        document.getElementById("spanNom").innerHTML= "-"
        document.getElementById("spanME").innerHTML= "-"
        document.getElementById("spanNotas").innerHTML= "-"
        document.getElementById("spanC").innerHTML= "-"
        document.getElementById("spanS").innerHTML= "-"
        document.getElementById("spanMed").innerHTML= "-"
        
    } else {
        footer.classList.remove("erro");
        mensagem.innerHTML = "Cálculo realizado com sucesso";
    
        document.getElementById("spanRA").innerHTML= ra
    document.getElementById("spanNom").innerHTML= nom
    document.getElementById("spanME").innerHTML= me
    document.getElementById("spanNotas").innerHTML= "bimestres: N1: "+i+"; N2: "+ii+"; N3: "+iii+"; N4: "+iv+";"
    document.getElementById("spanC").innerHTML= conceito
    document.getElementById("spanS").innerHTML= s
    document.getElementById("spanMed").innerHTML= media.toFixed(2)

    }
    
        
    
}
function fnotanegativa(i,ii,iii,iv,me){
    let a=""
    if(i<0 || i>10){
       a = document.getElementById("i")

    }else if(ii<0 || ii>10){
      a = document.getElementById("ii")
        
    }else if(iii<0 || iii>10){
       a = document.getElementById("iii")
        
    }else if(iv<0 || iv>10){
       a = document.getElementById("iv")
        
    }else if(me<0 || me>10){
       a = document.getElementById("me")
      

    }
   if (a) {
        a.focus();
    }
    
}
function fnome(nom){
    let a= 1
    for(i=0;i<nom.length;i++){
        if(nom[i]===" "){
            a=22
        }
    }
    return a
}