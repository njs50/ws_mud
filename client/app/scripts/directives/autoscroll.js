'use strict';

angular.module('clientApp')
  .directive('autoscroll', ['telnet', function (telnet) {
    return {
      restrict: 'A',
      scope: false,
      link: function postLink(scope, element) {

        // start enabled, disable during manual scrollback
        var bEnable = true;

        var endPosition = function() {
          // certain browsers have a bug such that scrollHeight is too small
          // when content does not fill the client area of the element
          return Math.max(element[0].scrollHeight, element[0].clientHeight) - element[0].clientHeight;

        };

        // whenever the content changes scroll
        var unbindEvent = telnet.$scope.$on(telnet.$scope.telnetEvents.bufferUpdated,function(){
          if (bEnable){
            element[0].scrollTop = endPosition();
          }
        });

        scope.$on('$destroy', function(){
          unbindEvent();
        });

        element.on('scroll', function(){

          if (endPosition() !== element[0].scrollTop) {
            bEnable = false;
          } else {
            bEnable = true;
          }
        });

      }
    };
  }]);
