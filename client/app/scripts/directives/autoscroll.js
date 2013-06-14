'use strict';

angular.module('clientApp')
  .directive('autoscroll', ['telnet', '$window', '$timeout', function (telnet,$window,$timeout) {
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
        var resetScroll = function(){
          bEnable = true;
          element[0].scrollTop = endPosition();
        };

        // on space or enter reset scroll
        var keypressScroll = function(e){
          if(bEnable === false) {
            if (e.which === 13) {
              resetScroll();
            } else if (e.which === 32) {
              e.preventDefault();
              resetScroll();
            }
          }
        };

        angular.element($window).bind('resize',resetScroll);
        angular.element($window).bind('keydown',keypressScroll);

        scope.$on('$destroy', function(){
          unbindEvent();
          angular.element($window).unbind('resize',resetScroll);
          angular.element($window).unbind('keydown',keypressScroll);
        });

        element.on('scroll', function(){
          if (endPosition() !== element[0].scrollTop) {
            bEnable = false;
          } else {
            bEnable = true;
          }
        });

        // scroll to the end of the content once rendered (when there is content preloaded)
        $timeout(function(){
          resetScroll();
        },0);

      }
    };
  }]);
