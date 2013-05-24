'use strict';

angular.module('clientApp', ['templates-main'])

  // configure routes...
  .config(['$routeProvider', '$locationProvider', function ($routeProvider,$locationProvider) {

    $locationProvider.html5Mode(false);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
      })
      .otherwise({
        redirectTo: '/'
      });

  }]);
