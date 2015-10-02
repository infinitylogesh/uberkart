var app = require('express')();
// var request = require('request');
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var spawn = require('child_process').spawn;
var upc = null;

//var nsp1 = io.of('/nsp1');

var barcodeScanner = spawn('python',['scanBarcode.py']);

barcodeScanner.stderr.on('data',function(data){
		console.log("Scanner Error",data.toString());
	});



io.on('connection',function(socket){
	console.log("client connected");

	barcodeScanner.stdout.on('data',function(data){
		console.log(data.toString());
		io.emit("clientMessage",data.toString());
	});

	socket.on("message",function(msg){
		io.emit("clientMessage","Hi Client");
	});
});

server.listen(8080,function(){
	console.log("listnening 3000");
});