var SerialPort = require("serialport").SerialPort;
var sp = new SerialPort("/dev/ttyAMA0", {
  baudrate: 115200
}, true);

sp.on("open",function(){
	console.log("serial open");
	sp.on("data",function(data){
		//var hexData = data.toString('hex');
		console.log(data.toString('hex'));
	});

});