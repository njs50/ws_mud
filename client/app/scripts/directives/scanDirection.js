'use strict';

angular.module('clientApp')
  .directive('scanDirection', function () {


    var directionToArrow = function(direction) {

      switch(direction) {

      case 'north':
        return 'arrow-up';
      case 'up':
        return 'caret-up';

      case 'east':
        return 'arrow-right';

      case 'south':
        return 'arrow-down';
      case 'down':
        return 'caret-down';

      case 'west':
        return 'arrow-left';

      }

    };


    return {
      // templateUrl: 'templates/scanDirection.tpl.html',
      restrict: 'A',
      replace: false,
      scope: false,
      link: function(scope, el, attr) {

        el.addClass('icon-' + directionToArrow(attr.scanDirection));
        el.addClass('btn');

        // watch for changes in the mobs for this direction
        scope.autoscanScope.$watch('adjacentMobs.' + attr.scanDirection, function(oNewMobs){

          if (oNewMobs !== undefined) {
            el.removeClass('disabled muted');
            if (oNewMobs.length){
              el.addClass('btn-danger');
            } else {
              el.removeClass('btn-danger');
            }
          } else {
            el.removeClass('btn-danger');
            el.addClass('disabled muted');
          }

        },true);

        el.bind('click',function(){
          scope.directionClick(attr.scanDirection);
        });

      }
    };
  });
