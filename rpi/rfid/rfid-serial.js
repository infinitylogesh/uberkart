var SerialPort = require("serialport").SerialPort;
var HYM360 = require("./HYM360.js");


var sp = new SerialPort("/dev/ttyUSB0", {
  baudrate: 115200
}, true);

sp.on("open",function(){
	var writeData = new Buffer('a55a000d1a010000000b1d0d0a','hex'); // Initial command to start handshake communication.
	console.log("serial open");
	sp.write(writeData, function(err, results) {
      console.log('err ' + err);
      console.log(results);
    });

	sp.on("data",function(data){
		var responseHex = data.toString('hex');
		console.log(HYM360.parseResponse(responseHex)); // parse the response into RFID Tag ID  
		if(responseHex == 'a55a00111b0100000000000000000b0d0a') // response from RFID for the initial handshake command.
		{
			console.log('start');
			sp.write(HYM360.setContinousInventory(10000), function(err, results) { // Start continous inventory after successful handshake reponse from RFID
      			console.log('err ' + err);
      			console.log(results);
    			});
		}
	});

	
});

// a55a000d1a010000
// 000b1d0d0a
// a55a000d1a010000000c1a0d0a
// a55a000d1a010000
// 000b1d0d0a
// a55a000d1a010000000c1a0d0a
// a55a000a82000088
// 0d0a
//a55a00111b010000
//0000000000000b0d0a

// response : tag : a55a0019833000e2
//0030984107020218005bcd000001290d0a

//First : a55a000d1a010000000b1d0d0a
// Next get tx power : a55a0008121a0d0a
//
