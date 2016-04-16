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
            controller: 'ItemListController'
            })
        .state('payment', {
            url: '/payment',
            templateUrl: 'templates/payment.html',
            controller : 'paymentController',
            resolve: {	// Makes the socket from pair state is passed to itemlist state.
                transaction : function(itemListService) {
                    return itemListService.passTotal2Payment(); 
                }
            }
        })
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        })
        .state('paymentSuccessPage', {
            url: '/paymentSuccessPage',
            templateUrl: 'templates/paymentSuccessPage.html'
        });

    $urlRouterProvider.otherwise('/home');

})