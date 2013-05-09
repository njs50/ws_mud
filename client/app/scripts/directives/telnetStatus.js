'use strict';

angular.module('clientApp')
   .directive('telnetStatus', ['telnet',function (telnet) {

    return {
      templateUrl: 'templates/telnetStatus.tpl.html',
      restrict: 'E',
      replace: true,
      link: function(scope,element,attrs) {
        scope.telnetService = telnet;
      }
    };

  }]);
