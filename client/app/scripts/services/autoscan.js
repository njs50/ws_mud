'use strict';

angular.module('clientApp')

  .factory('autoscan', ['$rootScope', 'telnet', '$timeout', function ($rootScope,telnet,$timeout) {

    var $scope = $rootScope.$new();

    $scope.selectedDirection = '';
    $scope.adjacentMobs = {};

    var telnetScope = telnet.getScope();

    var roomChangedRegxp = /^(\[Exits:|You see nothing in the vicinity\.)/;
    var mobSplitRegexp = /,\s+(?=a|an|two|three|four|five|six|seven|eight|nine|ten)/;
    var mobContinuedRegexp = /^\s+(?=a|an|two|three|four|five|six|seven|eight|nine|ten)/;
    var directions = {n: 'north', e: 'east', s: 'south', w: 'west', u: 'up', d:'down' };


    var bUpdateNextPrompt = false;
    var bMatching = false;

    var tempMobs = {};
    var currentDirection = '';


    telnetScope.$on(telnetScope.telnetEvents.parseLine, function(e, line) {

      // if we see the room change then we need to update (in case of empty rooms)
      if (line.match(roomChangedRegxp)) {
        bUpdateNextPrompt = true;
        tempMobs = {};
      }

      // look for scan directions
      var aMatch = line.match(/^\s*\[?(Here|east|west|north|south|up|down)]?\s*:\s*(.*)$/);

      if (aMatch) {
        bUpdateNextPrompt = true;
        bMatching = true;
        currentDirection = aMatch[1].toLowerCase();
        tempMobs[currentDirection] = aMatch[2].toLowerCase();
      } else if (line.match(mobContinuedRegexp)) {
        tempMobs[currentDirection] += line;
      } else {
        bMatching = false;
      }


    });



    telnetScope.$on(telnetScope.telnetEvents.parsePrompt, function(e,prompt) {

      if (bUpdateNextPrompt) {

        // reformat data + split into arrays
        for (var key in tempMobs) {
          tempMobs[key] = tempMobs[key].replace(/^\s*/, '').split(mobSplitRegexp);
        }

        // add any directions found in prompt, but not present in room.
        var aMatch = prompt.match(/<.*\s([NESWUD]*)>/i);
        if (aMatch){
          for (var idx in aMatch[1]) {
            var dir = aMatch[1][idx].toLowerCase();
            if (!tempMobs.hasOwnProperty(directions[dir])){
              tempMobs[directions[dir]] = [];
            }
          }
        }




        $scope.selectedDirection = '';
        $scope.adjacentMobs = tempMobs;

        tempMobs = {};
        bMatching = false;
        bUpdateNextPrompt = false;

        $timeout(function(){
          $scope.$apply('adjacentMobs');
        },0)

      }


    });



    // Public API here
    return {

      directionExists: function(direction) {
        direction = direction || $scope.selectedDirection;
        return $scope.adjacentMobs.hasOwnProperty(direction);
      },

      containsMobs: function(direction) {
        direction = direction || $scope.selectedDirection;
        return $scope.adjacentMobs.hasOwnProperty(direction) && ($scope.adjacentMobs[direction].length > 0);
      },

      getScope: function(){
        return $scope;
      }

    };

  }]);
