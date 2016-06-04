var socket = io(window.location.origin);

socket.on('connect', function(){
    console.log("You're connected!");
    socket.emit('whoami');
})


window.AudioContext = window.AudioContext || window.webkitAudioContext;

var rafID = null;
var curTarget;
var davidVoice = new AudioContext();
var userId;

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
var canvasContext1 = document.getElementById("meter1").getContext("2d");
var canvasContext2 = document.getElementById("meter2").getContext("2d");

function gotStream(stream) {
    mediaStreamSource = davidVoice.createMediaStreamSource(stream);
    var meter = createAudioMeter(davidVoice);
    mediaStreamSource.connect(meter);
    window.setInterval(function(){drawLoop(meter);}, 200);
}

function drawLoop( item ) {
    var temp = item.volume*50;
    console.log("Your current volume: ", temp);
    if (temp>curTarget && temp<curTarget+1) {
        socket.emit('progressMade', userId);
    }
}

socket.on('updateBar', function(arr){
    console.log("Bar updated");
    canvasContext1.fillStyle = "green";
    canvasContext2.fillStyle = "green";
    canvasContext1.fillRect(0, 0, arr[0], 150);
    canvasContext2.fillRect(0, 0, arr[1], 150);
});

socket.on('socketid', function(id){
    userId=id;
    console.log("$$$User ID: ",userId);
});

socket.on('newTarget', function(target){
    console.log("Target received");
    curTarget=target;
    document.getElementsByClassName("target")[0].innerHTML = ('Target: '+target);
    document.getElementsByClassName("target")[1].innerHTML = ('Target: '+target);
})
