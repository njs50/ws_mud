'use strict';

angular.module('clientApp')
  .controller('MapViewCtrl', ['$scope', 'map', function ($scope, map) {

    $scope.map = map;

  }]);

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