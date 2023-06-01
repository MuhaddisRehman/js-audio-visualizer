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
        ctx.fillRect(canvas.width/2-x, canvas.height-barHeight, barWidth, barHeight)
        x += barWidth+0.1;
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
        ctx.fillRect(x, canvas.height-barHeight, barWidth, barHeight)
        x += barWidth;
    }
}