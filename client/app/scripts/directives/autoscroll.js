'use strict';

angular.module('clientApp')
  .directive('autoscroll', ['$window', '$timeout',
    function ($window, $timeout) {
    return {
      restrict: 'E',
      scope: {
        content: '='
      },
      link: function postLink(scope, element) {

        // start enabled (in case not specified)
        var bEnabled = true;

        var oHolder = element.parent();

        // recieve pause command (and toggle state)
        oHolder.bind('pause',function(){
          bEnabled = !bEnabled;
        });

        var endPosition = function() {
          // certain browsers have a bug such that scrollHeight is too small
          // when content does not fill the client area of the element
          return Math.max(oHolder[0].scrollHeight, oHolder[0].clientHeight) - oHolder[0].clientHeight;

        };

        // watch the autoscroll var for updates...
        var watch1 = scope.$watch('content', function(value){
          oHolder.html(value);
          if (bEnabled){
            oHolder[0].scrollTop = endPosition();
          }
        });



        // scroll to end and enable autoscroll if window is resized
        var resetScroll = function(){
          bEnabled = true;
          oHolder[0].scrollTop = endPosition();
        };

        // on space or enter reset scroll
        var keypressScroll = function(e){
          if(bEnabled === false) {
            if (e.which === 13) { // space
              resetScroll();
            } else if (e.which === 32) { // esc
              e.preventDefault();
              resetScroll();
            }
          }
        };

        angular.element($window).bind('resize',resetScroll);
        angular.element($window).bind('keydown',keypressScroll);

        scope.$on('$destroy', function(){
          watch1();
          angular.element($window).unbind('resize',resetScroll);
          angular.element($window).unbind('keydown',keypressScroll);
          oHolder.unbind('pause');
        });

        oHolder.on('scroll', function(){
          if (endPosition() === oHolder[0].scrollTop) {
            bEnabled = true;
          }
        });

        // scroll to the end of the content once rendered (when there is content preloaded)
        $timeout(function(){
          resetScroll();
        },0);

      }
    };
  }]);
