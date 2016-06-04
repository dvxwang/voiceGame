var socket = io(window.location.origin);

socket.on('connect', function(){
	console.log("You're connected!");
})