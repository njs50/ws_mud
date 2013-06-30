'use strict';

angular.module('clientApp')
  .factory('map', ['$rootScope', 'telnet', '$location',
    function ($rootScope,telnet, $location) {
    // Service logic
    // ...

    var $scope = $rootScope.$new();

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

    $scope.posX = 14;
    $scope.posY = 0;


    $scope.aMove = [];
    $scope.oCurrentMove = {direction:'', type:'exit'};


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
          for (var j=0; j < aMapLines.length; j = j + 2 ) {
            aMapLines[j] = aMapLines[j].substring(0,29);
            if (aMapLines[j].match(/\|/)) {
              console.log('padding map due to line ' + j + ' : ' + aMapLines[j]);
              aMapLines.unshift('                                  ');
              break;
            }
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
          $location.path('/map');

        });

      } else {

        // scan for movement
        // if we just moved the correct way, advance to next move in step
        var aMove = line.match(/(?:You|You follow)\s(\S+\s?\S*)\s(north|east|south|west|up|down)\.$/);
        if (aMove && aMove[2] === $scope.oCurrentMove.direction) {
          _private.moveStep();
        }

      }

    });



    var getRoom = function(x,y) {
      if (y >= 0 && y < $scope.aMap.length && x >= 0 && x < $scope.aMap[y].length && $scope.aMap[y][x] !== ' ' ) {
        return $scope.aMap[y][x];
      } else {
        return '';
      }

    };

    var getRoomID = function(x,y) {
      return x.toString() + ',' + y.toString();
    };


    var _private = {

      getShortestPath: function(findX,findY) {

        var oShortest = {};
        var aUnprocessed = [];

        var createRoom =  function(x,y,path,cost) {
          return {
            x: x,
            y: y,
            id: getRoomID(x,y),
            path: path,
            cost: cost
          };
        };



        var searchID = getRoomID(findX,findY);

        // clone an array and add an item onto it
        var push = function(array,object) {
          // clone array
          var aNew = array.slice(0);
          aNew.push(object);
          return aNew;
        };

        // sort function for array of exits.
        var sortByCost = function(a,b) {
          return a.cost - b.cost;
        };

        var addExit = function(aEdges, oRoom, dir) {

          var x,y;

          // direction string to co-ord change
          switch(dir) {
          case 'north':
            x = 0;
            y = -1;
            break;
          case 'south':
            x = 0;
            y = 1;
            break;
          case 'east':
            x = 1;
            y = 0;
            break;
          case 'west':
            x = -1;
            y = 0;
            break;
          }

          var roomX = oRoom.x + x + x;
          var roomY = oRoom.y + y + y;

          // we don't want to ever go back to a node that we already have the shortest path for
          if (!oShortest.hasOwnProperty(getRoomID(roomX,roomY))) {

            // get room text (2*the direction over)
            var sRoom = getRoom(roomX, roomY);

            if (sRoom !== '') {

              // make sure the room is connected if it exists
              var sExit = getRoom(oRoom.x + x, oRoom.y + y);

              switch(sExit) {

              // door (add a lil extra cost for the hassle of opening it)
              case '+':
                aEdges.push(createRoom(roomX, roomY, push(oRoom.path, {direction: dir, type: 'door'}), oRoom.cost + 11));
                return;

              // standard exists
              case '|':
              case '-':
                aEdges.push(createRoom(roomX, roomY, push(oRoom.path,{direction: dir, type: 'exit'}), oRoom.cost + 10));
                return;

              // not connected
              case '':
              case ' ':
                return;

              // some other odd character
              default:
                aEdges.push(createRoom(roomX, roomY, push(oRoom.path,{direction: dir, type: 'unknown'}), oRoom.cost + 13));
                return;
              }

            }

          }

          return;

        };

        // get any adjacent rooms and sort by cost
        var getEdges = function(oRoom) {

          var aEdges = [];

          // add any adjacent rooms
          addExit(aEdges, oRoom, 'north');
          addExit(aEdges, oRoom, 'east');
          addExit(aEdges, oRoom, 'south');
          addExit(aEdges, oRoom, 'west');
          // aEdges.sort(sortByCost);

          return aEdges;


        };

        var processRoom = function(oRoom) {

          // get adjacent rooms
          var aAdjacent = getEdges(oRoom);
          var oKeys = {};

          // get hash of adjacent room ids
          for (var l = 0; l < aAdjacent.length; l++) {
            oKeys[aAdjacent[l].id] = true;
          }

          if (aAdjacent.length) {

            // loop over unprocced things
            for (var i = 0 ; i < aUnprocessed.length; i++) {

              // update the unprocessed array with any nodes that are closer than they were before
              if (oKeys.hasOwnProperty(aUnprocessed[i].id)) {
                for (var j = aAdjacent.length - 1; j >= 0; j--) {
                  if (aUnprocessed[i].id === aAdjacent[j].id) {
                    if (aUnprocessed[i].cost < aAdjacent[j].cost) {
                      aUnprocessed[i] = aAdjacent[j];
                    }
                    // remove from adjacent list now that we've seen it (so we dont add a duplicate)
                    aAdjacent.splice(j,1);
                  }
                }
              }

            }

            // anything left in here needs to be added to the unprocessed list
            for (var k  = 0; k < aAdjacent.length; k++) {
              aUnprocessed.push(aAdjacent[k]);
            }

          }

          // if we still have unprocessed nodes
          if (aUnprocessed.length) {

            aUnprocessed.sort(sortByCost);

            // get the closest unproccessed node
            var oClosest = aUnprocessed.splice(0,1)[0];

            // add to the shortest distance object
            oShortest[oClosest.id] = oClosest;

            if ( oClosest.id === searchID) {
              // don't need to process any further
              return;
            }

            // processes the closest room...
            processRoom(oClosest);

          }


          return;




        };

        var oStart = createRoom($scope.posX,$scope.posY,[],0);

        oShortest[oStart.id] = oStart;

        processRoom(oStart);

        if (oShortest.hasOwnProperty(searchID)) {
          return oShortest[searchID].path;
        } else {
          return [];
        }

      },

      moveStep: function() {
        if ($scope.aMove.length) {
          $scope.oCurrentMove = $scope.aMove.splice(0,1)[0];
          _private.move();
        } else {
          $scope.oCurrentMove.direction = '';
        }

      },

      move: function(){
        telnet.send($scope.oCurrentMove.direction);
        $location.path('/');
      }


    };


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
      },

      moveTo: function(x,y) {

        $scope.aMove = _private.getShortestPath(x,y);
        if ($scope.aMove.length) {
          _private.moveStep();
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