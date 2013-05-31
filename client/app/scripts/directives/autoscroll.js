'use strict';

angular.module('clientApp')
  .directive('autoscroll', ['telnet', function (telnet) {
    return {
      restrict: 'A',
      scope: false,
      link: function postLink(scope, element) {

        // start enabled, disable during manual scrollback
        var bEnable = true;
        var prevPos = 0;

        var endPosition = function() {
          // certain browsers have a bug such that scrollHeight is too small
          // when content does not fill the client area of the element
          return Math.max(element[0].scrollHeight, element[0].clientHeight) - element[0].clientHeight;

        };

        // whenever the content changes scroll
        telnet.$scope.$on(telnet.$scope.telnetEvents.bufferUpdated,function(){
          console.log('buffer++ : ' + bEnable + ' : ' + element[0].scrollTop + ' : ' + endPosition());
          if (bEnable){
            prevPos = endPosition();
            element[0].scrollTop = prevPos;
          }
        });

        element.on('scroll', function(){
          console.log('there be scrolling: ' + bEnable + ' : ' + element[0].scrollTop + ' : ' + endPosition());
          if (endPosition() !== element[0].scrollTop && element[0].scrollTop !== prevPos ) {
            bEnable = false;
          } else {
            bEnable = true;
          }
        });

      }
    };
  }]);
