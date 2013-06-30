'use strict';

angular.module('clientApp')
  .directive('mapView', function () {

    var charToClass = function(char) {
      switch(char) {
      case 'O':
      case '>':
      case '<':
      case 'X':
      case '?':
        return 'room';
      case '*':
        return 'here';
      }
    };

    var charToContent = function(char) {
      switch(char) {
      case '-':
        return '<i class="icon-resize-horizontal"></i>';
      case '|':
        return '<i class="icon-resize-vertical"></i>';
      case '+':
        return '+';
      case '?':
        return '?';
      case '>':
        return '<i class="icon-sort-up"></i>';
      case '<':
        return '<i class="icon-sort-down"></i>';
      case 'X':
        return '<i class="icon-sort"></i>';

      }
    };

    var getMapHTML = function(map) {

      var aMap = map.$scope.aMap;

      var aMapHTML = [];

      var roomClick = function() {
        var oData = $(this).data();
        map.moveTo(parseInt(oData.x,10),parseInt(oData.y,10));
      };

      for (var y = 0; y < 13; y++) {
        var oRow = angular.element('<div>');
        oRow.addClass(y % 2 ? 'mapSpaceRow' : 'mapRoomRow' );
        for (var x = 0; x < 29; x++) {
          var thisClass = charToClass(aMap[y][x]);
          var oCell = angular.element('<div>')
            .append(charToContent(aMap[y][x]))
            .addClass(thisClass)
            .data('x',x)
            .data('y',y)
            .appendTo(oRow)
          ;

          if (thisClass === 'room') {
            oCell.bind('click',roomClick);
          }

        }
        aMapHTML.push(oRow);
      }

      return aMapHTML;

    };
    return {
      restrict: 'A',
      replace: false,
      controller: 'MapViewCtrl',
      link: function postLink(scope, element) {

        element.addClass('map');

        element.append(getMapHTML(scope.map));
      }

    };

  });

/*

You survey the area, then consult your atlas:

      O-O-O-O     O-O+>   O-O     Key:
          |       | + |   | |
        O-O     O-O > O > O-O     *  you
        |       | |     |   |     O  room
        O     O-O-O-O-O O-> O     ?  overlap
        |     +   | | | +   |     +  door
        O O-O-*   O-O-O-O-O-O     |  ns exit
        | |       | |             -  ew exit
O-O     O O       O-O             >  up exit
  |     | |                       <  down exit
  O   O-O-O-O-O-O                 X  u&d exit
  |             |                 (Field)
  O-O     O-O   O       O-O-O     (Forest)

<B|447hp 553e 155mv 155wm 6418920xp NW>

15w x 7h
*/