'use strict';

angular.module('clientApp')
  .directive('autoscroll', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {

        // start enabled, disable during manual scrollback
        var bEnable = true;

        var endPosition = function() {
          // certain browsers have a bug such that scrollHeight is too small
          // when content does not fill the client area of the element
          return Math.max(element[0].scrollHeight, element[0].clientHeight) - element[0].clientHeight;

        };


        // whenever the content changes scroll
        scope.$watch('telnet.$scope.outputBuffer',function(){
          if (bEnable){
            element[0].scrollTop = endPosition();
          }
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
  });
