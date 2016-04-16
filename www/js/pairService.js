/*  Pair Service */
/*  Service to get the NFC details and establish a socket connectiona and share socket to next page */

//ToDo : Add error handling for socket connection failures.

angular.module('uberKart')

.factory('pairService', function($q, $timeout) {

    var pairServiceInstance = {};

    pairServiceInstance.nfcTag = null;

    // Changing the nfc.addNdefListener which listens for NFCtags to promise 
    pairServiceInstance.getNfcTag = function() {
        var dfd = $q.defer();
        nfc.addNdefListener(function(nfcEvent) {
            var tag = nfcEvent.tag,
                ndefMessage = tag.ndefMessage,
                self = this;
            self.nfcTag = nfc.bytesToString(ndefMessage[0].payload).substring(3);
            console.log("NFC read");
            dfd.resolve(self.nfcTag); // Convert the nfc payload to readable format.
        }, function() {
            // callback success.
        }, function(error) {
            dfd.reject(error);
        });
        return dfd.promise;
    }
   

    //1. get nfc tag and concatenate with the url to form socket url
    //2. initialize a socket connection.
    //3. Make the test socket handshake
    //4. Make the socket available for further communication throught the app.


    return pairServiceInstance;

});