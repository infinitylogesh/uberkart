angular.module('uberKart')

// This is the controller for itemlist.html page 
.controller('ItemListController', ['$scope','$timeout', '$ionicListDelegate', 'itemListService',
    function($scope,$timeout, $ionicListDelegate,itemListService) {

    $scope.items = [];

    $scope.total = 0;

    var product1 = {
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

    var product4 = {
        upc : 123456,
        name : "Aasai",
        price : 1,
        qty : 1,
        promotions :["buy1get1"]
    };

    var product5 = {
        upc : 12346,
        name : "Aasai",
        price : 1,
        qty : 1,
        promotions :["buy1get1"]
    };

    var product6 = {
        upc : 1236,
        name : "Aasai",
        price : 1,
        qty : 1,
        promotions :["buy1get1"]
    };

    var product8 = {
        upc : 1231,
        name : "Aasai",
        price : 1,
        qty : 1,
        promotions :["buy1get1"]
    };

    var product7 = {
        upc : 11,
        name : "Aasai",
        price : 1,
        qty : 1,
        promotions :["buy1get1"]
    };

    var product9 = {
        upc : 123112,
        name : "Aasai",
        price : 1,
        qty : 1,
        promotions :["buy1get1"]
    };


    

    itemListService.updateList(product1,$scope);
    itemListService.updateList(product2,$scope);
    itemListService.updateList(product3,$scope);
    itemListService.updateList(product4,$scope);
    itemListService.updateList(product5,$scope);
    itemListService.updateList(product6,$scope);
    itemListService.updateList(product7,$scope);
    itemListService.updateList(product8,$scope);
        itemListService.updateList(product9,$scope);





    

    console.log(itemListService.product);

    // socket connection is established and newly recieved item are updated to the scope
    itemListService.listenForNewItem('nsp1',$scope);

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

            $scope.qtyDecreasing = true;

            if ($scope.items[$index].qty >= 1) {
                itemListService.notifyProductRemoval($scope,$scope.items[$index]);
                $scope.items[$index].qty--;
                itemListService.applyPromotion($scope.items[$index],$scope);
                $scope.total = itemListService.calculateItemTotal($scope.items);
                $scope.amountSaved = itemListService.calculateTotalAmountSaved($scope.items);
            }

            // To highlight the change in quantity. Class will be removed after the timeout. 
            $scope.quantityChanged[$index] = "quantity-animation";
            $timeout(function() {
                $scope.quantityChanged[$index] = null;
            }, 200);
        }


    }
]);