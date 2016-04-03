var app = require('express')();
// var request = require('request');
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var spawn = require('child_process').spawn;
var upc = null;


var nsp1 = io.of('/nsp1');

//var barcodeScanner = spawn('python',['scanBarcode.py']);

var barcodeScanner = spawn('node',['--use_strict','rfid/rfid-serial.js']);

barcodeScanner.stderr.on('data',function(data){
		console.log("Scanner Error",data.toString());
	});

barcodeScanner.stdout.on('data',function(data){
		console.log(data.toString());
		io.emit("clientMessage",data.toString());
	});


io.on('connection',function(socket){
	console.log("client connected");
	io.emit("handshake","helloApp");
});

server.listen(8080,function(){
	console.log("listnening 8080");
});