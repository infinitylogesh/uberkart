var app = require('express')();
var request = require('request');
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var upc = null;


app.get('/', function(req, res){

res.sendfile(__dirname+'/index.html');

});

app.get('/app2', function(req, res){
res.sendfile(__dirname+'/index2.html');
});

server.listen(80,function(){
	console.log("listnening 3000");
});