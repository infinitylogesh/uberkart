angular.module('uberKart')

// This is the controller for payment.html page 
.controller('paymentController', ['$scope','$state','$ionicPopup','$timeout','transaction',
    function($scope,$state,$ionicPopup,$timeout, transaction) {
    	$scope.total = transaction.total;
        transaction.timestamp = Firebase.ServerValue.TIMESTAMP;
        transaction.paymentMethod = "card";
        console.log(angular.toJson(transaction));

        var ref = new Firebase('https://vivid-torch-1432.firebaseio.com/transactions'), // update the url 
        refCart = new Firebase('https://vivid-torch-1432.firebaseio.com/cart/' + transaction.cartID);


    	$scope.paymentSuccessPopup = function(){
    		var loadingPopup = $ionicPopup.show({
    			template : '<ion-spinner icon="crescent" class="loadingSpinner"></ion-spinner>',
    			cssClass : 'loadingPopup'
    		});
    		return loadingPopup;
    	};

    	$scope.pay = function(){

            // transaction data is updated to the database.
            ref.push(angular.copy(transaction),function(error){
                if(error){
                    console.log('transaction save failure !');
                }else{ // if transaction is updated successfully
                    refCart.set({}); // remove the products added to cart data
                    var paymentPopup = $scope.paymentSuccessPopup();
                    $timeout(function() {
                         paymentPopup.close();
                        $state.go('paymentSuccessPage');
                    }, 3000);
                }
            }); // to remove $$hashkey from angular.
            
        }
           

    	

    }]);