'use strict';


// main controller for the app...
angular.module('clientApp')
  .controller('MainCtrl', ['$scope', '$rootScope','$window', function ($scope,$rootScope,$window) {

    // set the initial windowheight
    $rootScope.windowHeight = $window.innerHeight;

    // update whenever the window triggers the resize event
    angular.element($window).bind('resize',function(){
      if ($rootScope.windowHeight !== $window.innerHeight) {
        $rootScope.windowHeight = $window.innerHeight;
        $rootScope.$apply('windowHeight');
      }
    });


  }])
;
