
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var WIDTH=50;
var HEIGHT=50;
var rafID = null;

var davidVoice = new AudioContext();

try {
    // monkeypatch getUserMedia
    navigator.getUserMedia = 
    	navigator.getUserMedia ||
    	navigator.webkitGetUserMedia ||
    	navigator.mozGetUserMedia;

    // ask for an audio input
    navigator.getUserMedia(
    {
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
    }, gotStream, didntGetStream);
} catch (e) {
    alert('getUserMedia threw exception :' + e);
}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;
var canvasContext = document.getElementById( "meter" ).getContext("2d");

function gotStream(stream) {
    mediaStreamSource = davidVoice.createMediaStreamSource(stream);
    var meter = createAudioMeter(davidVoice);
    mediaStreamSource.connect(meter);
    window.setInterval(function(){drawLoop(meter);}, 250);
}

function drawLoop( item ) {
    canvasContext.fillStyle = "green";
    console.log("Reached drawLoop: ", item.volume);
    if (item.volume>0.01) {
        console.log("%%%: ",item.volume);
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        WIDTH+=50;
    }
}