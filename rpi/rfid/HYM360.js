const CMD = {
	startFrame :'A55A',
	endFrame : '0D0A',
	continousInventory : '82',
	onceInventory : '80',
	hardwareVersion : '00'
};

var HYM360 = class{

/*  
	toHex : Converts the value passed into Hex and adds zeroes before based on the bytes required.
	Example : toHex(10,1) -> '0a'
  */

toHex(value,noOfBytes){
	var hexValue = value.toString(16),
	zeroPaddingCount = (noOfBytes*2) - hexValue.length;
	hexValue = ('0').repeat(zeroPaddingCount) + hexValue; // adding zeros before if hex value is not even.
	return hexValue;
}

/*  
	Hex frame to be written to RFID module is constructed here.
	Frame = Start frame (a55a)  + 00 + Length + command + data + Check code + end frame (0d0a).
  */

getHexFrame(data,command){

		var frameLength = 2+2+1+(data.toString().length / 2)+1+2, // Start byte + Length + Commant + data + Check digit + End byte
		frame = CMD.startFrame + '00' +this.toHex(frameLength,1) + command + data + 'BF' + CMD.endFrame;
		return Buffer(frame,'hex');
}

/*
   Function to get the Hex frame for continous inventory.
   numOfTime : Decimal value of number of times RFID should read.  Make it to 0 for indefinite reading.  
 */

setContinousInventory(numOfTimes){	// numofTime = 00
	 var value =  this.getHexFrame(this.toHex(numOfTimes,2),CMD.continousInventory);
	 console.log(value);
	 return value;
}

/*
   Function to parse the response from RFID.
   Based on the command in the response , it is routed to required functions. 
 */

parseResponse(response){
	if(response.startsWith('a55a00'))
	{
		var data = response.split('a55a00')[1].slice(2,-6), // Removing the startfram , length , checkcode and end frame.
		command = data.slice(0,-(data.length-2)), // slicing the command in the data.
		self = this;
	
		switch(command){
			case '83':  // Continous inventory reponse.
				return self.getEPCData(data);
				break;
			default :
				console.log('default response',data);
		}
	}

	console.log("Unknown response :" + response);
}

getEPCData(data){

	return data.split('83')[1].slice(4,-6);

}

};

module.exports = new HYM360();