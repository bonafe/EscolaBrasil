window.geradorQRCode = null;
window.listaAlunos = [];

window.onload = () => {
    gerarQRCode("1"); 

    document.querySelector("#btnGerarQRCode").addEventListener("click", () =>{
        
        let textoQRCode = `${document.querySelector("#nome").value}-${document.querySelector("#numero").value}`;
        gerarQRCode(textoQRCode);                
    });

    let inputArquivoCSV = document.querySelector("#arquivoCSV");

    document.querySelector("#btnEnviarCSV").addEventListener("click", ()=>{
        inputArquivoCSV.click();
    });

    document.querySelector("#btnGerarPDF").addEventListener("click", ()=>{
        gerarPDF();
    });
    

    inputArquivoCSV.addEventListener("change", ()=>{
        const reader = new FileReader();
        reader.onload = evento => { 
            let conteudoBase64 = evento.target.result.split(",")[1];
            let conteudoUnicode = b64DecodeUnicode(conteudoBase64);
            processarCSVListaAlunos(conteudoUnicode);
        };
        reader.readAsDataURL(inputArquivoCSV.files[0]);
    }); 
}

function gerarQRCode(textoQRCode){
    let textoSemAcentos = retira_acentos(textoQRCode);
    let containerQRCode = document.querySelector("#containerQRCode");
    if (!window.geradorQRCode){
        window.geradorQRCode = new QRCode(containerQRCode, textoSemAcentos);
    }else{
        window.geradorQRCode.clear();
        window.geradorQRCode.makeCode(textoSemAcentos);
    }
}

function processarCSVListaAlunos (csv){
    window.listaAlunos = [];
    let linhas = csv.split("\n");
    for (let iLinha = 1; iLinha < linhas.length; iLinha++){
        let campos = linhas[iLinha].split(",");
        
        if (campos[0] && campos[1]){

            console.log (`Nome:${campos[0]} --- Número:${campos[1]}`);                    
            window.listaAlunos.push({nome:campos[0],numero:campos[1]});
        }
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}  

function gerarPDF(){
    const doc = new window.jspdf.jsPDF();            

    const imagens_por_pagina = 3;
    let imagemAtual = 1;
    let x = 70;
    let y = 15;

    for (let iAluno in window.listaAlunos){

        let aluno = window.listaAlunos[iAluno];

        if (imagemAtual == 1){
            x = 70;
            y = 15;
        }

        let textoQRCode = `${aluno.nome}-${aluno.numero}`;
        gerarQRCode(textoQRCode);

        let imgQRCode = containerQRCode.querySelector("img");
        doc.addImage(imgQRCode.src.split(",")[1], "JPG", x, y);

        doc.text (aluno.nome, x, y-5);
        doc.text (aluno.numero, x, y+74);                

        imagemAtual++;
        y += 95;

        if ((imagemAtual > imagens_por_pagina) && (iAluno < (window.listaAlunos.length-1))){
            imagemAtual = 1;
            doc.addPage();
        }                
    }

    let nomeArquivoPDF = `${dataEmString(new Date())}_qrcode-alunos.pdf`;            
    doc.save(nomeArquivoPDF);
}

function dataEmString(data){    
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0'); //January is 0!
    let ano = data.getFullYear();
    let hora = String(data.getHours()).padStart(2, '0');
    let minuto = String(data.getMinutes()).padStart(2, '0');
    return `${ano}-${mes}-${dia}_${hora}-${minuto}`;
}

//Copiado de https://pt.stackoverflow.com/questions/237762/remover-acentos-javascript
function retira_acentos(str) {
    let com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";

    let sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";

    let novastr="";
    for(let i=0; i<str.length; i++) {
        let troca=false;
        for (let a=0; a<com_acento.length; a++) {
            if (str.substr(i,1)==com_acento.substr(a,1)) {
                novastr+=sem_acento.substr(a,1);
                troca=true;
                break;
            }
        }
        if (troca==false) {
            novastr+=str.substr(i,1);
        }
    }
    return novastr;
}       