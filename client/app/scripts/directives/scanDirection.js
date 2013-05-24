'use strict';

angular.module('clientApp')
  .directive('scanDirection', ['autoscan', function (autoscan) {


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

      case 'here':
        return 'bolt';

      case 'refresh':
        return 'refresh';

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
        if (attr.scanDirection  !== 'refresh') {
          autoscan.$scope.$watch('adjacentRooms.' + attr.scanDirection, function(oNewMobs){
            if (oNewMobs !== undefined) {
              el.removeClass('disabled muted btn-danger btn-info');
              if (oNewMobs.type === 'mobs'){
                el.addClass('btn-danger');
              } else if (oNewMobs.type === 'locked' || oNewMobs.type === 'dark'){
                el.addClass('btn-info');
              }
            } else {
              el.removeClass('btn-danger btn-info');
              el.addClass('disabled muted');
            }
          },true);
        }

        el.bind('click',function(){
          scope.directionClick(attr.scanDirection);
        });

      }
    };
  }]);
