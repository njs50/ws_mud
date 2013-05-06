'use strict';

angular.module('clientApp', [])

  // configure routes...
  .config(['$routeProvider', function ($routeProvider) {

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
