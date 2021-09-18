
export class TextoParaVoz{
	
	static _instance = null;
	
	static get INSTANCE (){
		if (!TextoParaVoz._instance){
			TextoParaVoz._instance = new TextoParaVoz();
		}
		return TextoParaVoz._instance;
	}
	
	constructor(){

		this.synth = window.speechSynthesis;
	}

	selecionarVozPTBR() {		
	  	for (let iVoice in this.synth.getVoices()){
			let voice = this.synth.getVoices()[iVoice];
			if (voice.lang.toUpperCase == "PT-BR"){
				return voice;
			}
		}
		return null;
	}


	falar(texto){
	    if (this.synth.speaking) {
	        console.error('speechSynthesis.speaking');
	        return;
	    }
	    
	    let utterThis = new SpeechSynthesisUtterance(texto);

	    utterThis.onend = function (event) {
	        console.log('SpeechSynthesisUtterance.onend');
	    }

	    utterThis.onerror = function (event) {
	        console.error('SpeechSynthesisUtterance.onerror');
	    }

 		utterThis.voice = this.selecionarVozPTBR();
	    utterThis.pitch = 1;
	    utterThis.rate = 1;
	    this.synth.speak(utterThis);
	}
}
