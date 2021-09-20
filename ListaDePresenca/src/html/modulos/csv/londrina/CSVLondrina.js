export class CSVLondrina{
    constructor(){        
    }    

    static processarCSV(conteudo){

        let turma = prompt("Digite o nome da turma:","sem turma");
        
        let linhas = conteudo.split("\n");

        let inicioDados = 14;

        let numeroAtual = null;

        let terminou = false;

        window.listaAlunos = [];

        for (let iLinha = inicioDados; (iLinha < linhas.length) && !terminou; iLinha++){
            let campos = linhas[iLinha].split(",");
            let numeroLinha = parseInt(campos[0]);

            //Se é um número inteiro guarda como número do aluno atual
            if (Number.isInteger(numeroLinha)){
                numeroAtual = numeroLinha;
            }

            try{
                //Se tem conteudo e não tem @ é porque é o nome do aluno
                if ((campos[1].indexOf("@") == -1) && (campos[1].length > 0)){
                    console.log (`${numeroAtual} --- ${campos[1]}`);
                    window.listaAlunos.push({turma:turma, numero:numeroAtual, nome:campos[1]});
                }
            }catch(err){
                terminou = true;
            }
        }
    }
}