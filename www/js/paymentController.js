angular.module('uberKart')

// This is the controller for payment.html page 
.controller('paymentController', ['$scope','$ionicPopup','$timeout','total',
    function($scope,$ionicPopup,$timeout, total) {
    	$scope.total = total;

    	$scope.paymentSuccessPopup = function(){
    		var paymentSuccess = $ionicPopup.alert({
    			title: 'Payment Success!',
    			template : 'Thank you for shopping with us'
    		});

    		return paymentSuccess;
    	};

    	$scope.pay = function(){

    		$scope.paymentSuccessPopup().then(function(res){
            	console.log("Paymnet Success");
            });
		}
           

    	

    }]);