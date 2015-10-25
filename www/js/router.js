angular.module('uberKart')

.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
  .state('itemlist',{
    url : '/itemlist',
    templateUrl : 'templates/itemlist.html',
    controller : 'ItemListController'
  })
  .state('payment',{
    url : '/payment',
    templateUrl : 'templates/payment.html'  
})
  .state('pair',{
    url : '/pair',
    templateUrl : 'templates/pair.html'  
})
  .state('home',{
    url : '/home',
    templateUrl : 'templates/home.html'  
});

  $urlRouterProvider.otherwise('/home');

})
