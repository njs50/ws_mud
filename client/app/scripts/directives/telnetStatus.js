'use strict';

angular.module('clientApp')
   .directive('telnetStatus', ['telnet',function (telnet) {

    return {
      restrict: 'A',
      replace: false,
      link: function(scope, el) {

        var e1 = telnet.$scope.$watch('bConnected', function(bConnected){
          if (bConnected) {
            el
              .removeClass('disconnected')
              .addClass('connected')
              .off('click', telnet.connect)
              .on('click', telnet.disconnect)
            ;
          } else {
            el
              .removeClass('connected')
              .addClass('disconnected')
              .off('click', telnet.disconnect)
              .on('click', telnet.connect)
            ;
          }
        });

        scope.$on('$destroy', function(){
          e1();
        });

      }
    };

  }]);


// <a>
//   <span ng-hide="telnet.$scope.bConnected" ng-click="telnet.connect(telnet.$scope.server,telnet.$scope.port)" class="disconnected">connect</span>

//   <span ng-show="telnet.$scope.bConnected"ng-click="telnet.disconnect()" class="connected">disconnect</span>
// </a>

