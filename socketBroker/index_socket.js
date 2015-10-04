
// This index file was used Before implementing P2P connection between pi and mobile app using socket and reverse proxy

var app = require('express')();
var request = require('request');
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var functions = require('./functions.js'); /* Holds all the functions */
var upc = null;

/* [HACK - NEEDS PERMANENT SOLUTION ] initialize all the namespaces from 0 to 10/ Cart IDs so that client can connect.*/
for (var i = 0; i <= 10; i++) {
    functions.initializeNamespace(io, 'nsp' + i);
}

/* mySql Connection declaration/initialisiation */
var connection = mysql.createConnection({
    host: 'localhost',  
    user: 'root',
    password: 'uberkart',
    database: 'uberkart'
});


/* Connecting to the mySQL database .[REMEBER TO FIX THE BUG IN CLOSING THE CONNECTION] */
connection.connect(function(err) {
    if (err) {
        console.log("Mysql connection failure", err);
    } else {
        console.log("Mysql connection success");
    }
});


app.get('/',function(req,res){
    console.log(req.query.upc);
    functions.getUpcDetails(req.query.upc, " ", connection, functions.initializeNamespace(io, "nsp1"));
    res.send("hi");
});



// [BUG] SQL CONNECTION END ISSUE - CONNECTIONS ARE NOT CLOSED AFTER QUERIES.

// url ='http://52.69.119.194/garage/uberKart/logic.xsjs?transid=1245&cartid=12&UPC='+UPC+'&addorrem='+addorremove+'&timetaken=20',


/*  On socket connection , Message event handler is set. 
    msg[0] : Message type - alert or message 
             if message type is message - Details of the UPC is fetched and emitted.
             if message type is alert - alert message is directly emitted.
    msg[1] : Namespace
    msg[2] : payload - UPC in case of message or alert message in case of alert
*/

io.on('connection', function(socket) {
        console.log("Client connected");
        socket.on('message', function(msg) {
                nsp = functions.initializeNamespace(io, msg[1]); /*  Namespace is dynamically generated for each request */
                if (msg[0] == 'message') {
                    functions.getUpcDetails(msg[2], " ", connection, nsp);
                } else if (msg[0] == 'alert') {
                    console.log("alert");
                    nsp.emit('alert', msg[2]);
                }
                console.log(msg);
        });
});


/* Server runs at 8080 port */

server.listen(8080, function() {
    console.log("listnening 3000");
});