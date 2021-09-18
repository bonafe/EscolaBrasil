//USANDO A BIBLIOTECA
//https://github.com/mebjas/html5-qrcode

import { ServiceUtils } from "./service_utils.js";
import { TextoParaVoz } from "./TextoParaVoz.js"

export class LeitorQRCode{
    
    constructor(){

        TextoParaVoz.INSTANCE;
        this.html5QrCode = null;

        this.somQRCodeLido = new Audio('./audio/qrcode_lido.mp3');

        this.cameras = document.querySelector("#cameras");
        this.containerCamera = document.querySelector("#containerCamera");
        this.qrCodeLidos = document.querySelector("#qrCodeLidos");        
        this.urlDestino = document.querySelector("#urlDestino");
        this.ultimoQRCodeLido = undefined;
        this.listaQRCode = [];

        this.cameraAtiva = false;

        //Download CSV
        {
          document.querySelector("#downloadCSV").addEventListener("click", ()=> {
            this.downloadCSV();
          });
        }

        //Configura URL de Destino
        {
          let valorURLDestino = localStorage.getItem("urlDestino");
          if (valorURLDestino){
            this.urlDestino.value = valorURLDestino;
          }
          this.urlDestino.addEventListener ("keyup", ()=> {
            localStorage.setItem("urlDestino", this.urlDestino.value);
          });
        }

        //Envio da lista de QR Code lidos
        {
          document.querySelector("#btnEnviarLista").addEventListener("click", () =>{
            console.log ("Enviando lista de QRCodes lidos");
            console.dir(this.listaQRCode);
            this.efetuarPostLista (this.urlDestino.value, this.listaQRCode).then ((retorno) => {
                if (retorno){
                  alert (`Lista enviada com sucesso!`);
                }else{
                  alert (`Não foi possível enviar lista!`);
                }
            }).catch((erro) => {
              alert (`Não foi possível enviar lista! Erro: ${erro}`);
            });
          });
        }

        //Trata escolha da câmera e inicializar o leitor de QR Code
        {
          this.btnMudarEstado = document.querySelector("#estadoCamera");

          this.btnMudarEstado.addEventListener("click", ()=>{

            this.cameraAtiva = !this.cameraAtiva;
            this.containerCamera.style.display = (this.cameraAtiva ? 'block' : 'none');
            this.cameras.disabled = this.cameraAtiva;

            if (this.cameraAtiva){
              this.iniciarLeitor(this.cameras.value);
              this.btnMudarEstado.innerText = "Parar";            
            }else{
              this.pararLeitor();
              this.btnMudarEstado.innerText = "Iniciar";            
            }                    
          });
        }

        this.povoarListaCameras();
    }

    leitorAtivo(){
      return this.cameraAtiva;
    }

    povoarListaCameras(){
        // This method will trigger user permissions
        Html5Qrcode.getCameras().then(devices => {
          /**
           * devices would be an array of objects of type:
           * { id: "id", label: "label" }
           */
          if (devices && devices.length) {

            //Povoa o select com as câmeras disponíveis
            for (let iDevice in devices){
              
              let device = devices[iDevice];
              let camera = document.createElement("option");
              camera.value = device.id;
              camera.innerHTML = device.label;
              if (iDevice == (devices.length-1)){
                camera.selected = true;
              }
              this.cameras.appendChild(camera);
            }            
            this.btnMudarEstado.disabled = false;
          }
        }).catch(err => {
          alert("Não foi possível recuperar a lista de câmeras!")
        });
    }

    iniciarLeitor(cameraId){
        // Create instance of the object. The only argument is the "id" of HTML element created above.
        this.html5QrCode = new Html5Qrcode("reader");

        this.html5QrCode.start(
          cameraId,     // retreived in the previous step.
          {
            fps: 10,    // sets the framerate to 10 frame per second
            qrbox: 250  // sets only 250 X 250 region of viewfinder to
                        // scannable, rest shaded.
          },
          qrCodeMessage => {

            if (this.ultimoQRCodeLido !== qrCodeMessage){
                this.ultimoQRCodeLido = qrCodeMessage;
                this.adicionarItem(this.ultimoQRCodeLido);
            }
            //console.log(`QR Code detected: ${qrCodeMessage}`);
          },
          errorMessage => {
            // parse error, ideally ignore it. For example:
            //console.log(`QR Code no longer in front of camera.`);
          })
        .catch(err => {
          // Start failed, handle it. For example,
          console.log(`Unable to start scanning, error: ${err}`);
        });
    }

    adicionarItem(valorQRCode){

        let falou = false;
        let partes = valorQRCode.split("-");
        if (partes.length == 2){
          if (Number.isInteger(parseInt(partes[1]))){
            TextoParaVoz.INSTANCE.falar(partes[0].split(" ")[0]);
            falou = true;
          }
        }
        if (!falou){
          this.somQRCodeLido.play();
        }

        const agora_itz = new Date();
		console.log(agora_itz);
		console.log(agora_itz.toISOString().slice(0,19).replace('T',' '));
		var agora=agora_itz.toISOString().slice(0, 19).replace('T', ' ');
		console.log(agora);

        let li = document.createElement("li");
        li.classList.add('list-group-item');
        li.innerText = `${agora} --- ${valorQRCode}`;        
        this.qrCodeLidos.insertBefore(li, this.qrCodeLidos.firstChild);

        this.listaQRCode.push ({data:agora, conteudo:valorQRCode});
    }

    pararLeitor(){
      this.html5QrCode.stop().then((ignore) => {
        // QR Code scanning is stopped.
      }).catch((err) => {
        // Stop failed, handle it.
      });
    }

    efetuarPostLista(url, objeto){
      return fetch(
          url,
          {
              method: "POST",
              headers:{
                  "Accept":"application/json",
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(objeto)
          })
      .then(resposta => {
        if (resposta.ok) {
          return true;
        } else {          
          throw new Error("Erro na requisição!");
        }        
      })      
      .catch( error => {
          throw error;
      });
  }

  downloadCSV(){
    let conteudoCSV = "data:text/csv;charset=utf-8,";
    conteudoCSV += "data, nome, numero, direcao\n";
    this.listaQRCode.forEach (presenca => {      
      let partes = presenca.conteudo.split("-");      
      conteudoCSV += `${presenca.data.toISOString()},${partes[0]},${partes[1]},0`;
    });

    let nomeArquivoCSV = `${this.dataEmString(new Date())}_lista-presenca.csv`;

    let encodedUri = encodeURI(conteudoCSV);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download",nomeArquivoCSV);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);    
  }

  dataEmString(data){    
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0'); //January is 0!
    var ano = data.getFullYear();
    let hora = String(data.getHours()).padStart(2, '0');
    let minuto = String(data.getMinutes()).padStart(2, '0');
    return `${ano}-${mes}-${dia}_${hora}-${minuto}`;
  }
}
