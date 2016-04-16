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

        $state.go('itemlist'); // chumma added for browser debugging and to bypass nfc.

        pairService.getNfcTag().then(function(nfcTag) { // if NFC Tag is detected go to itemList.
            console.log(nfcTag);
            $state.go('itemlist');
        }, function(error) {
            $scope.showPopup().then(function(res){
            	console.log("NFC failed");
            });
        });

    }
]);