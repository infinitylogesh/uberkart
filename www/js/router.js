angular.module('uberKart')

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('pair', {
            url: '/pair',
            templateUrl: 'templates/pair.html',
            controller: 'pairController'
        })
        .state('itemlist', {
            url: '/itemlist',
            templateUrl: 'templates/itemlist.html',
            controller: 'ItemListController',
            resolve: {	// Makes the socket from pair state is passed to itemlist state.
                pairSocket: function(pairService) {
                    return pairService.initializeSocket(); 
                }
            }
        })
        .state('payment', {
            url: '/payment',
            templateUrl: 'templates/payment.html',
            controller : 'paymentController',
            resolve: {	// Makes the socket from pair state is passed to itemlist state.
                total : function(itemListService) {
                    return itemListService.passTotal2Payment(); 
                }
            }
        })
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        });

    $urlRouterProvider.otherwise('/home');

})