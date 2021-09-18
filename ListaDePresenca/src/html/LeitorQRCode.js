//USANDO A BIBLIOTECA
//https://github.com/mebjas/html5-qrcode

export class LeitorQRCode{
    
    constructor(){

        this.html5QrCode = null;

        this.cameras = document.querySelector("#cameras");
        this.containerCamera = document.querySelector("#containerCamera");
        this.qrCodeLidos = document.querySelector("#qrCodeLidos");        
        this.ultimoQRCodeLido = undefined;
        this.listaQRCode = [];

        this.cameraAtiva = false;

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

        document.querySelector("#btnEnviarLista").addEventListener("click", () =>{
          console.log ("Enviando lista de QRCodes lidos");
          console.dir(this.listaQRCode);
        });

        this.povoarListaCameras();
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

        const agora = new Date()
        let li = document.createElement("li");
        li.classList.add('list-group-item');
        li.innerText = `${agora.toISOString()} --- ${valorQRCode}`;        
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
}