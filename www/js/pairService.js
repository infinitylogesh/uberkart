/*  Pair Service */
/*  Service to get the NFC details and establish a socket connectiona and share socket to next page */

//ToDo : Add error handling for socket connection failures.

angular.module('uberKart')

.factory('pairService', function($q, $timeout) {

    var pairServiceInstance = {};

    pairServiceInstance.nfcTag = null;
    pairServiceInstance.socketConnectionCheckTimeout = 500; // check until this duration , Still socket connection not established , reject

    // TODO : this should be replaced with the reverse proxy url and nfc url.
    pairServiceInstance.socketUrl = "http://192.168.2.7:8080/";


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

    // Socket is initialized. Beware that the initialized socket mostly be not connected and empty.
    pairServiceInstance.initializeSocket = function() {
        var dfd = $q.defer();
        socket = io.connect(this.socketUrl);
        dfd.resolve(socket);
        return dfd.promise;
    }

    // If socket connection is not made even after socketConnectionCheckTimeout promise is rejected. 
    //  If handshake message is recieved promise is resolved.
    pairServiceInstance.socketConnectionTest = function(socket) {
        var dfd = $q.defer(),
            self = this;

        // if handshake message is recieved , Resolve the promise.   
        socket.on("handshake", function(msg) {
            dfd.resolve(msg);
        });

        // if socket connection is not established in 500ms reject the promise   
        $timeout(function() {
            if (socket.connected != true) {
                dfd.reject("msg");
            }
        }, self.socketConnectionCheckTimeout);

        return dfd.promise;
    }

    //1. get nfc tag and concatenate with the url to form socket url
    //2. initialize a socket connection.
    //3. Make the test socket handshake
    //4. Make the socket available for further communication throught the app.


    return pairServiceInstance;

});