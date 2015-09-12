angular.module('uberKart',['ionic'])

.factory('itemListService',function(){
	
	var serviceInstance  = {};


	// Socket connection is established with the given namespace.
	serviceInstance.initializeSocket = function(namespace){

	var host = 'http://52.11.233.164:8080/',
	socketUrl = host + namespace,
	socket = io.connect(socketUrl);
	console.log(socket);
	return socket
	}

	// On arrival of the new item from the cart , UpdateList function is called
	// Update the list based on the content.
    serviceInstance.listenForNewItem = function(namespace, $scope) {

    	var self = this;
        socket = self.initializeSocket(namespace);
        socket.on('connect', function() {
            console.log("socket on");
            socket.on('clientMessage', function(msg) {
                console.log(msg);
                $scope.$apply(self.updateList(msg, $scope)); // to update the binding changes in the UI 
            });
        });

    }

    // Original item list in the scope and new item recived in socket is
    // compared. If UPC is already present in the item List. Quantity of
    // the product is increased.
    serviceInstance.compareList = function(newItem, itemList) {
        for (i = 0; i < itemList.length; i++) {
        	console.log(itemList[i].upc,newItem.upc);
            if (itemList[i].upc == newItem.upc) {
                return i;
            }
        }
        return -1;
    }

    // calculates the total price of the item in the array of objects ( itemlist )
    serviceInstance.calculateItemTotal = function(itemList){
    	var total = 0;
    	for (i = 0; i < itemList.length; i++) {
    		total += (itemList[i].qty * itemList[i].price);
    	}
    	return total;
    }

    // Based on the item recived , item List is updated. 
    serviceInstance.updateList = function(newItem, $scope) {

        var self = this,
        itemList = $scope.items;
            if (itemList.length > 0) {
                compareResult = this.compareList(newItem, itemList);
                console.log("compare result",compareResult);
                if ((compareResult != -1)) {
                    itemList[compareResult].qty++;
                } else {
                    itemList.push(newItem);
                }
		}else{
			itemList.push(newItem);
		}
        $scope.total = this.calculateItemTotal(itemList);
        return $scope;

    }


	return serviceInstance;
});