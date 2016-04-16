angular.module('uberKart')

// This is the controller for itemlist.html page 
.controller('ItemListController', ['$scope','$timeout', '$ionicListDelegate', 'itemListService',
    function($scope,$timeout, $ionicListDelegate,itemListService) {
        
    $scope.items = [];

    $scope.total = 0;

   /* var product1 = {
        upc : 1234,
        name : "Snickers",
        price : 1,
        qty : 1,
        promotions :["buy2get1"]
    };

    var product2 = {
        upc : 1235,
        name : "Mars",
        price : 1,
        qty : 1,
        promotions :[]
    };

    var product3 = {
        upc : 12345,
        name : "Aasai",
        price : 1,
        qty : 1,
        promotions :["buy1get1"]
    };
*/
   
    // socket connection is established and newly recieved item are updated to the scope
    itemListService.listenForNewItem($scope);

    // TODO : WHAT IF SOCKET CONNECTION FAILS ?
    
    	// toggleEditQty is an array which holds the boolean value for all the list. 
    	// Initially the value for each list item will be 'ubdefined'
        $scope.toggleEditQty = [];
        $scope.quantityChanged =[];
        $scope.qtyDecreasing = false;
        $scope.amountSaved = 0;



        // This function toggles the plus and minus icons and closes the swiped list item. 
        $scope.editItem = function($index) {
            console.log($scope.toggleEditQty[$index] || false);
            $scope.toggleEditQty[$index] = !$scope.toggleEditQty[$index];
            //$ionicListDelegate.closeOptionButtons();
        }

        // This function increaments the quantity of item by 1
        $scope.increaseQty = function($index) {
            itemListService.updateList($scope.items[$index],$scope); /* Consider as if the item is added */
            console.log($scope.notificationCase);
            // To highlight the change in quantity. Class will be removed after the timeout. 
            $scope.quantityChanged[$index] = "quantity-animation";
            $timeout(function() {
                $scope.quantityChanged[$index] = null;
            }, 200);
        }

        // This function decreaments the quantity of item by 1 and 
        // it cannot be less than zero
        $scope.decreaseQty = function($index) {
            
            $scope.toggleEditQty[$index] = !$scope.toggleEditQty[$index]; // stub to enable add and reduce quantity button. Remove it.
            itemListService.removeProduct($scope,$index);  // service function to reduce the quantity and re apply promotion , total saved and total.
        }
    }
]);