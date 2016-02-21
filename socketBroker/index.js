var express = require('express')
var app = express();
var request = require('request');
var http = require('http');
var server = http.Server(app);
// var mysql = require('mysql');
var functions = require('./functions.js'); /* Holds all the functions */
var upc = null;

/* Removing mySql related code to support localhost het request */

/* mySql Connection declaration/initialisiation */
/*var connection = mysql.createConnection({
    host: 'localhost',  
    user: 'root',
    password: 'uberkart',
    database: 'uberkart'
});
*/

/* Connecting to the mySQL database .[REMEBER TO FIX THE BUG IN CLOSING THE CONNECTION] */
/*connection.connect(function(err) {
    if (err) {
        console.log("Mysql connection failure", err);
    } else {
        console.log("Mysql connection success");
    }
});*/


app.get('/',function(req,res){
    console.log(req.query.upc);
    console.log(req.connection.remoteAddress);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    functions.getUpcDetails(req.query.upc,res);  // Gets the UPC details and sends the response as json.

});

//

/* Server runs at 8080 port */

server.listen(8000, function() {
    console.log("listnening port 8000");
});