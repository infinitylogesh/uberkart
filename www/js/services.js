angular.module('uberKart', ['ionic'])

.factory('itemListService', function() {

    var serviceInstance = {};

    // ------
    /* Stubs */
    // ------


    var promotions = [{
        promotion: "buy1get1",
        eligibleQty: 1,
        freeQty: 1,
        promotionText:"Buy 1 and Get 1 Free"
    }, {
        promotion: "buy2get1",
        eligibleQty: 2,
        freeQty: 1,
        promotionText:"Buy 2 and Get 1 Free"
    }];

    // ---------
    /* Stubs End */
    // ---------

    var itemsWithPromotion = [],
        serviceInstance = {
            promotionAmountToBeReduced: 0
        };

    // Socket connection is established with the given namespace.
    serviceInstance.initializeSocket = function(namespace) {

        var host = 'http://52.26.96.210:8080/',
            socketUrl = host + namespace,
            socket = io.connect(socketUrl);
        console.log(socket);
        return socket
    }


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

    //  check if the given UPC has promotion
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
    serviceInstance.returnEligibleFreeQty = function(promotionsReturned, itemQty) {
        var self = this;
        console.log(itemQty, "is eligible");
        for (var x = 0; x < promotionsReturned.length; x++) {
            var promotionDefinition = self.getPromotionDefinition(promotionsReturned[x]),
                promotionRatio = promotionDefinition.eligibleQty / (promotionDefinition.eligibleQty + promotionDefinition.freeQty),
                numberOfQtyPromotionEligible = Math.floor(itemQty - (itemQty * promotionRatio));
            console.log("numberOfQtyPromotionEligible", numberOfQtyPromotionEligible);
            return (numberOfQtyPromotionEligible * promotionDefinition.freeQty); /*Retrun amount to be deducted.*/
        }
    }

    // apply promotion 
    // ISSUE : Reducing Item in the UI with promotion is faulty.
    serviceInstance.applyPromotion = function(item, $scope) {
        var self = this,
            promotionsReturned = self.checkItemHasPromotion(item),
            compareResult = self.compareList(item, $scope.items);
        $scope.items[compareResult].promotionAmountToBeReduced = (typeof $scope.items[compareResult].promotionAmountToBeReduced === "undefined") ? 0 : $scope.items[compareResult].promotionAmountToBeReduced;
        if (promotionsReturned) {
            console.log(promotionsReturned);
            self.updateItemsWithPromotions(item);
            var numberOfItemsToReduce = self.returnEligibleFreeQty(promotionsReturned, $scope.items[compareResult].qty);
            console.log("numberOfItemsToReduce", numberOfItemsToReduce);
            $scope.items[compareResult].promotionAmountToBeReduced = numberOfItemsToReduce * item.price;
            $scope.items[compareResult].promotionText = self.getPromotionDefinition(item.promotions[0]).promotionText;
            console.log("$scope.items[compareResult].promotionAmountToBeReduced", $scope.items[compareResult].promotionAmountToBeReduced);
        }
    }

    /*  ------------- */
    /*  Promotion End */
    /*  ------------- */



    // On arrival of the new item from the cart , UpdateList function is called
    // Update the list based on the content.
    serviceInstance.listenForNewItem = function(namespace, $scope) {

        var self = this;
        socket = self.initializeSocket(namespace);
        socket.on('connect', function() {
            console.log("socket on");
            socket.on('clientMessage', function(msg) {
                console.log(msg);
                msg.promotions = ["buy1get1"];
                console.log(Date());
                $scope.$apply(self.updateList(msg, $scope)); // to update the binding changes in the UI 
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
        return total;
    }

    // Based on the item recived , item List is updated. 
    serviceInstance.updateList = function(newItem, $scope) {

        var self = this,
            itemList = $scope.items,
            amountToBeReduced = 0,
            compareResult = -1;
        // No need to compare if it is the first item.
        if (itemList.length > 0) {
            compareResult = this.compareList(newItem, itemList);
            console.log("compare result", compareResult);
            if ((compareResult != -1)) {
                itemList[compareResult].qty++;
            } else {
                itemList.push(newItem);
            }
        } else {
            itemList.push(newItem);
        }
        self.applyPromotion(newItem, $scope);
        $scope.total = this.calculateItemTotal($scope.items);
        return $scope;

    }


    return serviceInstance;
});