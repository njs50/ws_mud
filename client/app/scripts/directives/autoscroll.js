'use strict';

angular.module('clientApp')
  .directive('autoscroll', ['telnet', '$window', function (telnet,$window) {
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

        // scroll to end and enable autoscroll if window is resized
        var resizeScroll = function(){
          bEnable = true;
          element[0].scrollTop = endPosition();
        };

        angular.element($window).bind('resize',resizeScroll);

        scope.$on('$destroy', function(){
          unbindEvent();
          angular.element($window).unbind('resize',resizeScroll);
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
