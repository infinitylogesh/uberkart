
/*  Gets the UPC details. Fetches from products table 
    emits the results to concerned namespace socket
*/
/*exports.getUpcDetails = function(upc,connection,res) {
    var sqlQuery = "SELECT * FROM products WHERE upc ='" + upc + "'",
    body = {};
    connection.query(sqlQuery, function(err, rows) {
        if (err) {
            console.log("mySql Querry error",err);
            //res.send(-1);
            // connection.end();
        } else {
             body = {
                upc: rows[0].upc,
                name: rows[0].name,
                qty: 1,
                price: rows[0].price
            }
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.jsonp(body);
            // connection.end();
        }
    });

}*/



var products = [{
    upc: "x0008vjm2b",
    name: "Snickers",
    qty: 1,
    price: 1
}, {
    upc: "8902968040208",
    name: "Mars",
    qty: 1,
    price: 0.50
}, {
    upc: "500066000815",
    name: "Aasai",
    qty: 1,
    price: 0.50
}];

exports.getUpcDetails = function(upc,res){

    for(var i=0;i<products.length;i++){
        if(products[i].upc == upc){
            console.log(products[i]);
            res.jsonp(products[i]);
        }
    }
    res.send("Get Error");
}
