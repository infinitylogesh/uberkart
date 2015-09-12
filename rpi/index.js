var app = require('express')();
var request = require('request');
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var upc = null;

var nsp1 = io.of('/nsp1');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'uberkart',
  database : 'uberkart'
});

connection.connect(function(err){
    if(err){
        console.log("Mysql connection failure",err);
    }
    else{
        console.log("Mysql connection success");    
    }
});

// [BUG] SQL CONNECTION END ISSUE - CONNECTIONS ARE NOT CLOSED AFTER QUERIES.

getUpcDetails = function(upc, res) {
    var sqlQuery = "SELECT * FROM products WHERE upc = " + upc;
    connection.query(sqlQuery, function(err, rows) {
        if (err) {
            res.send(-1);
            // connection.end();
        } else {
            body = {
                upc: rows[0].upc,
                name: rows[0].name,
                qty: 1,
                price: rows[0].price
            }
            console.log(body);
            nsp1.emit('clientMessage', body);
            res.send(rows);
            // connection.end();
        }
    });

}

app.get('/', function(req, res){
  upc = req.query.upc;
  getUpcDetails(upc,res);
});

var name = process.argv[2],
qty = process.argv[3],
// url ='http://52.69.119.194/garage/uberKart/logic.xsjs?transid=1245&cartid=12&UPC='+UPC+'&addorrem='+addorremove+'&timetaken=20',
body = {};

io.on('connection',function(socket){
    console.log("connected");
    socket.on('message',function(msg){
        // body = {
        //     upc : msg[0],
        //     name : msg[1],
        //     qty : msg[2],
        //     price : msg[3]
        // }
        nsp1.emit('clientMessage',msg); 
        console.log(msg);
    });
});

request('http://requestb.in/1mau7av1', function (error, response, body) {
console.log("request made");
nsp1.emit('clientMessage','Server here');
});

server.listen(8080,function(){
	console.log("listnening 3000");
});
