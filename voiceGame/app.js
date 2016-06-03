var express = require('express');
var app = express();
var path = require('path');
const http = require('http')
const server = http.createServer()
const PORT = 3000;
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));

server.on('request', app);

server.listen(PORT, function () {
  console.log('Server listening on PORT', PORT);
})

var routes = require('./routes.js');

app.use('/', routes);

module.exports = app;