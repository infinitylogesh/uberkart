angular.module('uberKart')

.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
  .state('itemlist',{
    url : '/itemlist',
    templateUrl : 'templates/itemlist.html',
    controller : 'ItemListController'
  });

  $urlRouterProvider.otherwise('/itemlist');

})
