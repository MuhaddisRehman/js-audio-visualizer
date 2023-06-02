const audio1 = document.getElementById('audio1');
audio1.src = 'Juhani Junkala [Retro Game Music Pack] Ending.wav';
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
console.log(audioCtx);

const container = document.getElementById('container');
const file = document.getElementById('fileUpload')
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioSrc, analyser;
let hue = 0;




audioSrc = audioCtx.createMediaElementSource(audio1);
analyser = audioCtx.createAnalyser();
audioSrc.connect(analyser);
analyser.connect(audioCtx.destination);

container.addEventListener('click', () => {
    audioCtx.resume()
    audio1.play();
    
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width/2) / bufferLength ;
    let barHeight;
    let x;
    const animation = () => {
        x=0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
        hue += 0.5;
        requestAnimationFrame(animation);
    };
    animation();
});

file.addEventListener('change', function(){
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    audio1.src = URL.createObjectURL(files[0])
    audio1.load()

})
const drawVisualizer = (bufferLength, x, barWidth, barHeight, dataArray)=>{
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        // Draw the bar using barHeight
        const red = i * barHeight/20;
        const green = i * 4;
        const blue = barHeight/ 2;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.beginPath();
        ctx.arc(canvas.width/2-x-1, canvas.height-barHeight, barHeight/20, 0, Math.PI * 2 )
        ctx.fill()
        ctx.fillRect(canvas.width/2-x, canvas.height-barHeight, barWidth/2, barHeight)
        x += barWidth;
    }
    for (let i = 0; i < bufferLength; i++) {
        console.log("as");
        barHeight = dataArray[i] * 2;
        // Draw the bar using barHeight
        const red = i * barHeight/20;
        const green = i * 4;
        const blue = barHeight/ 2;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.beginPath();
        ctx.arc(x+1, canvas.height-barHeight, barHeight/20, 0, Math.PI * 2 )
        ctx.fillRect(x, canvas.height-barHeight, barWidth/2, barHeight)
        ctx.fill()
        x += barWidth;
    }
}





// Define variables
let audioContext;
let audioStream;
let clapNode;

// Get start and stop buttons
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

// Add event listeners to buttons
startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

// Function to handle start recording button click
function startRecording() {
  // Check browser support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('getUserMedia is not supported on your browser');
    return;
  }

  // Create an audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Get user media (microphone)
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      // Store the audio stream
      audioStream = stream;

      // Create an instance of the audio worklet node
      audioContext.audioWorklet.addModule('clap-processor.js')
        .then(() => {
          clapNode = new AudioWorkletNode(audioContext, 'clap-processor');

          // Connect the audio stream to the clap node
          const microphone = audioContext.createMediaStreamSource(audioStream);
          microphone.connect(clapNode);

          // Event listener for clap detection
          clapNode.port.onmessage = (event) => {
            if (event.data === 'clap') {
              // Clap detected!
              console.log('Clap detected!');
              hue += 100;
              canvas.style.backgroundColor =`hsl(${hue}, 100%, 50%)` ;
              // Perform additional actions or logic here
            }
          };
        })
        .catch((error) => {
          console.error('Error setting up the audio worklet:', error);
        });
    })
    .catch(error => {
      console.error('Error accessing microphone:', error);
    });
}

// Function to handle stop recording button click
function stopRecording() {
  // Stop the audio stream tracks
  audioStream.getTracks().forEach(track => track.stop());

  // Disconnect the audio nodes
  clapNode.disconnect();
  audioContext.close();
}