var socketio= require('socket.io');
var express = require('express');
var app = express();
var path = require('path');
var http = require('http')
var server = http.createServer()
var PORT = 3000;
var bodyParser = require('body-parser')

server.on('request', app);

server.listen(PORT, function () {
  console.log('Server listening on PORT', PORT);
})

var io = socketio(server)
var target;
var player1 = {};
var player2 = {};
var clients=[];
function setTarget() {
    target = Math.floor(Math.random()*10);    
	io.emit("newTarget",target);
	console.log("Target sent");
};

io.on('connection', function(socket){
	console.log("New client: ",socket.id);

	console.log("444: ",io.connected);

	socket.emit("SocketID",socket.id);

	socket.on('whoami', function(){
        console.log("socket broadcast");
        socket.emit("socketid", socket.id);
    });

	if(!player1.id) {
		player1.id=socket.id;
		player1.width=0;

	}
	else {
		player2.id=socket.id;
		player2.width=0;
	}
	setTarget();

	socket.on('progressMade', function(playerId){
		if (player1.id===playerId) player1.width+=25;
		if (player2.id===playerId) player2.width+=25;
		console.log("Voice received: ");
		setTarget();
		io.emit('updateBar',[player1.width, player2.width]);
	})
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));


var routes = require('./routes.js');

app.use('/', routes);

module.exports = app;