var express = require('express')
var app = express();
var request = require('request');
var http = require('http');
var server = http.Server(app);
// var mysql = require('mysql');
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

console.log(app.use(express.static(__dirname+'/homepage')));

app.get('/',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //functions.getUpcDetails(req.query.upc,res);  // Gets the UPC details and sends the response as json.
    res.sendFile(__dirname+'/homepage/index.html');

});

//

/* Server runs at 8080 port */

server.listen(80, function() {
    console.log("listnening port 80");
});