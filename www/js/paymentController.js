angular.module('uberKart')

// This is the controller for payment.html page 
.controller('paymentController', ['$scope','$state','$ionicPopup','$timeout','total',
    function($scope,$state,$ionicPopup,$timeout, total) {
    	$scope.total = total;

    	$scope.paymentSuccessPopup = function(){
    		var loadingPopup = $ionicPopup.show({
    			template : '<ion-spinner icon="crescent" class="loadingSpinner"></ion-spinner>',
    			cssClass : 'loadingPopup'
    		});

    		return loadingPopup;
    	};

    	$scope.pay = function(){

    		var paymentPopup = $scope.paymentSuccessPopup();

            $timeout(function() {
            	paymentPopup.close();
            	$state.go('paymentSuccessPage');
            }, 3000);
		}
           

    	

    }]);