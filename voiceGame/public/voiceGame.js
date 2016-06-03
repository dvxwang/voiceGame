
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var WIDTH=50;
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

var target;
setTarget();

function setTarget() {
    target = Math.floor(Math.random()*3);    
    document.getElementsByClassName("target")[0].innerHTML = ('Target: '+target);
    document.getElementsByClassName("target")[1].innerHTML = ('Target: '+target);
};

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;
var canvasContext = document.getElementById("meter1").getContext("2d");

function gotStream(stream) {
    mediaStreamSource = davidVoice.createMediaStreamSource(stream);
    var meter = createAudioMeter(davidVoice);
    mediaStreamSource.connect(meter);
    window.setInterval(function(){drawLoop(meter);}, 100);
}

function drawLoop( item ) {
    canvasContext.fillStyle = "green";
    var temp = item.volume*50;
    console.log("Reached drawLoop: ", temp,target);
    if (temp>target && temp<target+1) {
        canvasContext.fillRect(0, 0, WIDTH, 150);
        WIDTH+=50;
        setTarget();
    }
}