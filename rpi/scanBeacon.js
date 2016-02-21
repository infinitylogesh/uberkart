var noble = require('noble');


var RSSI_LIMIT = -50;
var entered = false;

noble.on('stateChange', function(state) {
  if (state === 'poweredOn')
  {
  	noble.startScanning([], true);
	noble.on('discover', function(p){
		var rssi = p.rssi;
		
		if((p.rssi > RSSI_LIMIT)&&(entered==false)){
			// console.log(p.advertisement.manufacturerData.toString('hex') + "Entered the perimeter ");
			console.log("Ayyo ! kabbu Naveen - the selfish is near !!");
			entered = true;
		}
		if((p.rssi < RSSI_LIMIT)&&(entered==true)){
			//console.log(p.advertisement.manufacturerData.toString('hex') + "Entered the perimeter ");
			console.log("Habba!! Naveen - the selfish  left");
			entered = false;
		}

	});
  }
  else
    noble.stopScanning();
});

