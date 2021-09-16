export class LeitorQRCode{
    constructor(){

        this.qrCodeLidos = document.querySelector("#qrCodeLidos");        
        this.ultimoQRCodeLido = undefined;
        this.listaQRCode = [];

        document.querySelector("#btnEnviarLista").addEventListener("click", () =>{
          console.log ("Enviando lista de QRCodes lidos");
          console.dir(this.listaQRCode);
        });

        this.selecionarCamera();
    }

    selecionarCamera(){
        // This method will trigger user permissions
        Html5Qrcode.getCameras().then(devices => {
          /**
           * devices would be an array of objects of type:
           * { id: "id", label: "label" }
           */
          if (devices && devices.length) {
            this.cameraId = devices[0].id;
            this.iniciarLeitor();
          }
        }).catch(err => {
          // handle err
        });
    }

    iniciarLeitor(){
        // Create instance of the object. The only argument is the "id" of HTML element created above.
        const html5QrCode = new Html5Qrcode("reader");

        html5QrCode.start(
          this.cameraId,     // retreived in the previous step.
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
            console.log(`QR Code detected: ${qrCodeMessage}`);
          },
          errorMessage => {
            // parse error, ideally ignore it. For example:
            console.log(`QR Code no longer in front of camera.`);
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

        this.listaQRCode.appendChild ({data:agora, conteudo:valorQRCode});
    }
}