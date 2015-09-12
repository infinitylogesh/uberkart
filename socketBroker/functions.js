


/*  Gets the UPC details. Fetches from products table 
    emits the results to concerned namespace socket
*/
exports.getUpcDetails = function(upc,res,connection,nsp) {
    var sqlQuery = "SELECT * FROM products WHERE upc = " + upc;
    connection.query(sqlQuery, function(err, rows) {
        if (err) {
            console.log("mySql Querry error",err);
            //res.send(-1);
            // connection.end();
        } else {
            var body = {
                upc: rows[0].upc,
                name: rows[0].name,
                qty: 1,
                price: rows[0].price
            }
            console.log(body);
            nsp.emit('clientMessage', body);
            //res.send(rows);
            // connection.end();
        }
    });

}

exports.initializeNamespace = function(io,msg){
    var namespace = '/'+ msg;
    return io.of(namespace);
}