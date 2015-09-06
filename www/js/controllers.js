angular.module('uberKart')

// This is the controller for itemlist.html page 
.controller('ItemListController', ['$scope', '$ionicListDelegate', 'itemListService',
    function($scope, $ionicListDelegate,itemListService) {

    $scope.items = [];

    $scope.total = 0;

    // socket connection is established and newly recieved item are updated to the scope
    itemListService.listenForNewItem('nsp1',$scope);

    // TODO : WHAT IF SOCKET CONNECTION FAILS ?
    
    	// toggleEditQty is an array which holds the boolean value for all the list. 
    	// Initially the value for each list item will be 'ubdefined'
        $scope.toggleEditQty = [];

        // This function toggles the plus and minus icons and closes the swiped list item. 
        $scope.editItem = function($index) {
            console.log($scope.toggleEditQty[$index] || false);
            $scope.toggleEditQty[$index] = !$scope.toggleEditQty[$index];
            $ionicListDelegate.closeOptionButtons();
        }

        // This function increaments the quantity of item by 1
        $scope.increaseQty = function($index) {
            $scope.items[$index].qty++;
            $scope.total = itemListService.calculateItemTotal($scope.items);
        }

        // This function decreaments the quantity of item by 1 and 
        // it cannot be less than zero
        $scope.decreaseQty = function($index) {

            if ($scope.items[$index].qty >= 1) {
                $scope.items[$index].qty--;
                $scope.total = itemListService.calculateItemTotal($scope.items);
            }
        }


    }
]);