angular.module('uberKart')

.controller('pairController', ['$scope','$ionicPopup', '$state', 'pairService',
    function($scope,$ionicPopup,$state, pairService) {

    	$scope.showPopup = function(){
    		var pairPopup = $ionicPopup.alert({
    			title: 'Pairing Failed !',
    			template : 'Please close and restart app'
    		});

    		return pairPopup;
    	};

    /*	$scope.showPopup().then(function(res){
            	$state.go('itemlist');
            });*/

        pairService.getNfcTag().then(function(nfcTag) { // if NFC Tag is detected.
            console.log(nfcTag);
            return pairService.initializeSocket();
        }, function(error) {
            $scope.showPopup().then(function(res){
            	console.log("NFC failed");
            });
        }).then(function(socket) {   // Establish Socket connection if NFC tag is detected
        	console.log(socket);
            return pairService.socketConnectionTest(socket);
        }, function() {
             $scope.showPopup().then(function(res){
            	console.log("Socket connection failed");
            });
        }).then(function(msg) {   // If Socket handshake is successful , Change to itemlist screen.
            console.log("Handshake Success!");
            $state.go('itemlist');
        }, function() {
            $scope.showPopup().then(function(res){
            	console.log("Handhsake failed");
            });
        });

    }
]);