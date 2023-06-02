// Define the audio worklet processor
class ClapProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.clapDetected = false;
      this.prevValue = 0;
      this.clapThreshold = 0.1;
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const samples = input[0];
  
      let clapDetected = false;
      for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
  
        if (sample > this.clapThreshold && sample > this.prevValue) {
          clapDetected = true;
          break;
        }
  
        this.prevValue = sample;
      }
  
      if (clapDetected) {
        this.port.postMessage('clap');
      }
  
      return true;
    }
  }
  
  // Register the audio worklet processor
  registerProcessor('clap-processor', ClapProcessor);
  