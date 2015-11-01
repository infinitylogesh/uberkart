angular.module('uberKart', ['ionic', 'ngAnimate'])

.factory('itemListService', function($http, $timeout,$q) {

    var serviceInstance = {};

    // ------
    /* Stubs */
    // ------


    var promotions = [{
        promotion: "buy1get1",
        eligibleQty: 1,
        freeQty: 1,
        promotionText: "Buy 1 and Get 1 Free"
    }, {
        promotion: "buy2get1",
        eligibleQty: 3,
        freeQty: 2,
        promotionText: "Buy 2 and Get 1 Free"
    }];

    // ---------
    /* Stubs End */
    // ---------

    var itemsWithPromotion = [];
    var serviceInstance = {
        promotionAmountToBeReduced: 0,
        total: 0
    };

    // Notification Icon constants
    var notificationIconConstant = {
        success: "ion-checkmark-circled",
        congrats: "ion-thumbsup",
        info: "ion-information-circled"
    };

    var upcGetURL = "http://192.168.2.5:8000/?upc="


    /*  ------------------  */
    /*  Notification Start */
    /*  ------------------*/

    // Notification when product is removed.
    serviceInstance.notifyProductRemoval = function($scope, item) {
        $scope.notificationCase = this.getNotificationCase($scope.notificationCase);
        $scope.notificationText = item.name + " removed";
        $scope.notificationIcon = notificationIconConstant.success;
    }

    // Notifications that are displayed second to product added notification.

    serviceInstance.sisterNotification = function($scope, notificationText, duration, notificationIcon) {
        var self = this;
        $timeout(function() {
            $scope.notificationCase = self.getNotificationCase($scope.notificationCase);
            $scope.notificationText = notificationText;
            $scope.notificationIcon = notificationIcon;
        }, duration);
    }

    // Product addition notification
    serviceInstance.notifyProductAdded = function($scope, item) {
        $scope.notificationCase = this.getNotificationCase($scope.notificationCase);
        $scope.notificationText = item.name + " added";
        $scope.notificationIcon = notificationIconConstant.success;
    }

    // Notify products to be added for promotion eligibility
    serviceInstance.notifyProducts2Add = function($scope,item,partialPromotionQty,freeQty){
        var sisterNotificationText = " Add " + partialPromotionQty + " more and get " + freeQty + " free";
        this.sisterNotification($scope,sisterNotificationText,700,notificationIconConstant.info);
    }

    // Notify when the promotion is achieved.
    serviceInstance.notifyPromotionAchieved = function($scope,freeQty,item){
        var sisterNotificationText = "Congrats! You have earned " + freeQty + " free " + item.name;
        this.sisterNotification($scope, sisterNotificationText, 700, notificationIconConstant.congrats);
    }

    // Notify when a free product is added.
    serviceInstance.notifyFreeProductAddition = function($scope,item){
        $scope.notificationCase = this.getNotificationCase($scope.notificationCase);
        $scope.notificationText = item.name + " added as free !";
        $scope.notificationIcon = notificationIconConstant.congrats;
    }

    // to workwith ng-animate for switch case to generate case value dynamically
    serviceInstance.getNotificationCase = function(notificationCase) {
        var notificationCount = 4;
        notificationCase = ((typeof notificationCase === 'number') && (notificationCase < 4)) ? (notificationCase + 1) : 1;
        return notificationCase;
    }

    // Remaining quantities for promotion is notified. Based on partial promotion quantity and full quantity.
    // !$scope.qtyDecreasing is checked to avoid promotion notifications when product is removed.
    serviceInstance.notifyRemainingQty4Promotion = function(partialPromotionQty, promotion, item, $scope) {
        var freeQty = promotion.freeQty,
            eligibleQty = promotion.eligibleQty,
            self = this;
        if ((Math.abs(partialPromotionQty) < eligibleQty) && (partialPromotionQty < 0) && (!$scope.qtyDecreasing)) { // when promotion is not yet reached and when eligibleqty is not equal to remaining qty.
            partialPromotionQty = Math.abs(partialPromotionQty);
            self.notifyProductAdded($scope,item);
            self.notifyProducts2Add($scope,item,partialPromotionQty,freeQty);
        } else if ((partialPromotionQty == 0) && (!$scope.qtyDecreasing)) { // When promotion is reached.
            self.notifyProductAdded($scope,item);
            self.notifyPromotionAchieved($scope,freeQty,item);
        } else if (((partialPromotionQty > 0) || (partialPromotionQty == (-1 * eligibleQty))) && (!$scope.qtyDecreasing)) { // Notification for free products added.
            self.notifyFreeProductAddition($scope,item);
        } else if ($scope.qtyDecreasing) { // To toggle quantity decreasing flag.
            $scope.qtyDecreasing = false;
        }
    }

    /*  ------------------  */
    /*  Notification End   */
    /*  ------------------*/


    /*  --------------- */
    /*  Promotion Start */
    /*  --------------- */

    // items with promotions are added to a seperate array
    serviceInstance.updateItemsWithPromotions = function(newItem) {
        var item = {};
        item.upc = newItem.upc;
        item.promotions = newItem.promotions;
        itemsWithPromotion.push(item);
        console.log(itemsWithPromotion);
    }

    //  check if the given UPC has promotion, if true return promotion details
    serviceInstance.checkItemHasPromotion = function(item) {
        if (item.promotions.length > 0) {
            console.log(item.promotions);
            return item.promotions;
        } else {
            return false;
        }

    }

    //  get the definition ( eligibleQty , freeQty ) of a promotion
    serviceInstance.getPromotionDefinition = function(promotionName) {
        for (var x = 0; x < promotions.length; x++) {
            if (promotions[x].promotion == promotionName) {
                return promotions[x];
            }
        }

        console.log("Promotion not found");
    }




    // based on the quanity added , this function determines the free quantities applicable .
    serviceInstance.returnEligibleFreeQty = function(promotionsReturned, item, $scope) {
        var self = this,
            itemQty = item.qty;
        for (var x = 0; x < promotionsReturned.length; x++) {
            var promotionDefinition = self.getPromotionDefinition(promotionsReturned[x]),
                oneFullQty = promotionDefinition.eligibleQty + promotionDefinition.freeQty, // onefullqty = promotionqty + eligibleQty
                numberOfFullPromotions = Math.floor(itemQty / oneFullQty), // Number of full promotions that have happened is calculated.
                partialPromotionQty = itemQty - (numberOfFullPromotions * oneFullQty) - promotionDefinition.eligibleQty; // Partial promotion that should be applied is calculated.
            self.notifyRemainingQty4Promotion(partialPromotionQty, promotionDefinition, item, $scope);
            partialPromotionQty = (partialPromotionQty < 0) ? 0 : partialPromotionQty; // If partialpromotion Qty is in negative (qty left to eligible qty) , it is considered as zero 
            fullPromotionQty = numberOfFullPromotions * promotionDefinition.freeQty; // qty considered in full promotion 
            var finalPromotionQty = partialPromotionQty + fullPromotionQty;
            return (finalPromotionQty); /*Returna the qty to be deducted.*/
        }
    }

    // apply promotion 

    serviceInstance.applyPromotion = function(item, $scope) {
        var self = this,
            promotionsReturned = self.checkItemHasPromotion(item),
            compareResult = self.compareList(item, $scope.items);
        $scope.items[compareResult].promotionAmountToBeReduced = (typeof $scope.items[compareResult].promotionAmountToBeReduced === "undefined") ? 0 : $scope.items[compareResult].promotionAmountToBeReduced;
        if (promotionsReturned) {
            console.log(promotionsReturned);
            self.updateItemsWithPromotions(item);
            var numberOfItemsToReduce = self.returnEligibleFreeQty(promotionsReturned, $scope.items[compareResult], $scope);
            console.log("numberOfItemsToReduce", numberOfItemsToReduce);
            $scope.items[compareResult].promotionAmountToBeReduced = numberOfItemsToReduce * item.price;
            $scope.items[compareResult].promotionText = self.getPromotionDefinition(item.promotions[0]).promotionText;
            console.log("$scope.items[compareResult].promotionAmountToBeReduced", $scope.items[compareResult].promotionAmountToBeReduced);
        }else if(!$scope.qtyDecreasing){
            self.notifyProductAdded($scope, item); // notify product addition for products without promotion.
        }else{
            self.notifyProductRemoval($scope, item); // notify product removal for products without promotion.
            $scope.qtyDecreasing = false; // toggle quantity decreasing flag.
        }
    }

    /*  ------------- */
    /*  Promotion End */
    /*  ------------- */



    // On arrival of the new item from the cart , UpdateList function is called
    // Update the list based on the content.
    serviceInstance.listenForNewItem = function(namespace, $scope) {

        var self = this;
        var upcDetails = {};
        socket = $scope.socket;
        console.log("$scope.socket",$scope.socket);
        socket.on('connect', function() {
            console.log("socket on");
            socket.on('clientMessage', function(msg) {
                console.log(msg);
                console.log(Date());
                $http.get(upcGetURL + msg).then(function(resp) {
                    upcDetails = resp.data;
                    upcDetails.promotions = ["buy1get1"];
                    self.updateList(upcDetails, $scope); // Without $scope.$apply , Be cautious to check the update the binding changes in the UI 
                }, function(err) {
                    console.log("Get Error", err);
                });
            });
        });

    }

    // Original item list in the scope and new item recived in socket is
    // compared. If UPC is already present in the item List. Quantity of
    // the product is increased.
    serviceInstance.compareList = function(newItem, itemList) {
        for (i = 0; i < itemList.length; i++) {
            console.log(itemList[i].upc, newItem.upc);
            if (itemList[i].upc == newItem.upc) {
                return i;
            }
        }
        return -1;
    }

    // calculates the total price of the item in the array of objects ( itemlist )
    serviceInstance.calculateItemTotal = function(itemList) {
        var total = 0,
            self = this;
        for (i = 0; i < itemList.length; i++) {
            total += ((itemList[i].qty * itemList[i].price) - itemList[i].promotionAmountToBeReduced);
            console.log(itemList);
            console.log("gross total", total);
        }
        serviceInstance.total = total;
        return total;
    }

    serviceInstance.calculateTotalAmountSaved = function(itemList) {
        var totalSaved = 0,
            self = this;
        for (i = 0; i < itemList.length; i++) {
            totalSaved += itemList[i].promotionAmountToBeReduced;
        }
        return totalSaved;
    }



    // Based on the item recived , item List is updated. 
    serviceInstance.updateList = function(newItem, $scope) {

        var self = this,
            itemList = $scope.items,
            amountToBeReduced = 0,
            compareResult = -1;
        compareResult = this.compareList(newItem, itemList);
        console.log("compare result", compareResult);
        if ((compareResult != -1)) {
            itemList[compareResult].qty++;
            //self.notifyProductAddition(newItem, $scope);
        } else {
            itemList.push(newItem);
           // self.notifyProductAddition(newItem, $scope);
        }
        self.applyPromotion(newItem, $scope);
        $scope.total = self.calculateItemTotal($scope.items);
        $scope.amountSaved = self.calculateTotalAmountSaved($scope.items);
        return $scope;

    }

    serviceInstance.passTotal2Payment = function(){
        var dfd = $q.defer(),
        self = this;
        dfd.resolve(self.total);
        return dfd.promise;
    }

    return serviceInstance;
});