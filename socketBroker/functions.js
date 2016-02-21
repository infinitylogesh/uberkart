
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
            res.header("Access-Control-Allow-Headers", "Origin, X-Requestved-With, Content-Type, Accept");
            res.jsonp(body);
            // connection.end();
        }
    });

}*/



var products = [{
    upc: "8908001158305",
    name: "Fogg Spray",
    qty: 1,
    price: 2,
    promotions:[] // promotions: ["buy1get1"]
}, {
    upc: "8901526104680",
    name: "Loreal Paris",
    qty: 1,
    price: 0.50,
    promotions:["buy1get1"]
}, {
    upc: "8901491101820",
    name: "Lays Chips",
    qty: 1,
    price: 0.50,
    promotions:[]
},{
    upc: "8902080104093",
    name: "Pepsi 500ML",
    qty: 1,
    price: 0.99,
    promotions:[]
},{
    upc: "8901030515026",
    name: "Surf Powder",
    qty: 1,
    price: 1.99,
    promotions:[]
},{
    upc: "8902080404094",
    name: "Tropicana",
    qty: 1,
    price: 1.99,
    promotions:[]
},{
    upc: "8901499008459",
    name: "Keloggs",
    qty: 1,
    price: 1,
    promotions:[]
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
