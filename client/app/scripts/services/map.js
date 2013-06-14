'use strict';

angular.module('clientApp')
  .factory('map', ['$rootScope', 'telnet',
    function ($rootScope,telnet) {
    // Service logic
    // ...

    var $scope = $rootScope.$new();
/*
    $scope.aMap = [
      '              *              ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             '
    ];
*/
    $scope.aMap = [
      '      X-O-O-O     O-O+>   O-O',
      '          |       | + |   |  ',
      '        O-O     O-O > O > O-O',
      '        |       | |     |   |',
      '        O     O-O-O-O-O O-> O',
      '        |     +   | | | +   |',
      '        O O-O-*   O-<-O-O-O-O',
      '        | |       | |        ',
      'O-O     O O       ?-O        ',
      '  |     | |                  ',
      '  O   O-O-O-O-O-O            ',
      '  |             |            ',
      '  O-O     O-O   O       O-O-O'
    ];

    $scope.posX = 14;
    $scope.posY = 0;

    telnet.$scope.$on(telnet.$scope.telnetEvents.parseLine, function(e, line) {

      if (line === 'You survey the area, then consult your atlas:') {

        var aMapLines = [];
        var mapCatcherUnbind = telnet.$scope.$on(telnet.$scope.telnetEvents.parseLine, function(e, line) {
          aMapLines.push(line);
        });

        telnet.onNextPrompt('',function(){
          mapCatcherUnbind();

          // remove any blank lines before map starts
          while($.trim(aMapLines[0]) === '') {
            aMapLines.splice(0,1);
          }
          // make sure first line isn't a connection row
          if (aMapLines[0].match(/^[|+ ]*$/)) {
            aMapLines.unshift('                                  ');
          }

          // pad array if required
          while(aMapLines.length < 14) {
            aMapLines.push('                                  ');
          }

          aMapLines = aMapLines.splice(0,13);

          for (var i=0; i < aMapLines.length; i++ ) {
            if (aMapLines[i].length < 29) {
              aMapLines[i] = aMapLines[i]  + '                                  ';
            }
            aMapLines[i] = aMapLines[i].substring(0,29);
            var x = aMapLines[i].indexOf('*');
            if (x !== -1) {
              $scope.posX = x;
              $scope.posY = i;
            }
          }

          $scope.aMap = aMapLines;

          // now that we have parsed the text, lets build a node graph array




        });


      }

    });


    var _private = {

      createRoom: function(x,y) {
        return {
          x: x,
          y: y,
          aExits: []
        };
      },

      linkRooms: function(room1, room2, direction) {
        //if($.inArray(room1.aExits,room2) === -1)
      }

    };
/*


    // djikstras shortest path algorithm
    public function shortestPath (startRoom : Room, endRoom : Room) : Array {

      var aFinal : Array = new Array();
      var aAdjacent : Array = new Array();

      var current_node : PathNode = new PathNode(0,startRoom,new Array());

      while ( !nodeArrayContainsRoom(aFinal,endRoom) ) {

        // push the currnet_node (closest) onto the final nodes
        aFinal.push( current_node );

        for each (var oExit : Exit in current_node.room.room_aExits) {
          // only add this if the room isn't already in aFinal (and it's actually an exit, not just a placeholder)
          if ( oExit.room != null && !nodeArrayContainsRoom(aFinal,oExit.room) ){
            var aNewPath : Array = current_node.aPath.slice();
            aNewPath.push(oExit.command);
            aAdjacent.push( new PathNode( current_node.distance + oExit.room.travel_cost, oExit.room , aNewPath ) );
          }
        }

        // if there are still nodes to check continue. otherwise abandon ship
        if (aAdjacent.length > 0) {
          // sort the adjacent array so the closest thing will be last (to make for easy popping action)
          aAdjacent = aAdjacent.sortOn( "distance", Array.NUMERIC | Array.DESCENDING );
          current_node = aAdjacent.pop();
          // check if this is the room we are looking for!
          if (current_node.room == endRoom){
            return current_node.aPath;
          }
        } else break;
      }

      errorMessage('Target room appears unreachable from your current location');
      return null;

    }

    public function nodeArrayContainsRoom(aNode:Array, target_room: Room) : Boolean {
      for each (var node : PathNode in aNode) {
        if ( node.room == target_room) return true;
      }
      return false;
    }

  public class PathNode
  {

    public var distance : uint;
    public var room : Room;
    public var aPath : Array;


    public function PathNode(_distance:int,_room:Room,_aPath:Array)
    {
      this.distance   = _distance;
      this.room     = _room;
      this.aPath    = _aPath;
    }

  }


*/

    var _public = {

      '$scope': $scope,

      reverseDirection: function(dir) {
        switch(dir) {
        case 'north':
          return 'south';
        case 'east':
          return 'west';
        case 'south':
          return 'north';
        case 'west':
          return 'east';
        case 'up':
          return 'down';
        case 'down':
          return 'up';
        }
      }

    };

    // Public API here
    return _public;
  }]);


/*

You survey the area, then consult your atlas:

              *                   Key:

                                  *  you
                                  O  room
                                  ?  overlap
                                  +  door
                                  |  ns exit
                                  -  ew exit
                                  >  up exit
                                  <  down exit
                                  X  u&d exit
                                  (Forest)

w/no exits

              *                   Key:

*/