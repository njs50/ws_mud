'use strict';

angular.module('clientApp')

  .factory('autoscan', ['$rootScope', 'telnet', '$timeout', function ($rootScope,telnet,$timeout) {

    var $scope = $rootScope.$new();

    $scope.selectedDirection = '';
    $scope.adjacentRooms = {};

    var roomChangedRegxp = /^(\[Exits:|You see nothing in the vicinity\.)/;
    var mobSplitRegexp = /,\s+(?=a|an|the|two|three|four|five|six|seven|eight|nine|ten|[A-Z]\S+)/;
    var mobContinuedRegexp = /^\s+(?=a|an|the|two|three|four|five|six|seven|eight|nine|ten|[A-Z]\S+)/;
    var directions = {n: 'north', e: 'east', s: 'south', w: 'west', u: 'up', d:'down' };


    var bUpdateNextPrompt = false;
    var bMatching = false;

    var tempMobs = {};
    var currentDirection = '';


    telnet.$scope.$on(telnet.$scope.telnetEvents.parseLine, function(e, line) {

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
        tempMobs[currentDirection] = aMatch[2];
      } else if (line.match(mobContinuedRegexp)) {
        tempMobs[currentDirection] += line;
      } else {
        bMatching = false;
      }


    });



    telnet.$scope.$on(telnet.$scope.telnetEvents.parsePrompt, function(e,prompt) {

      if (bUpdateNextPrompt) {

        // reformat data + split into arrays
        for (var key in tempMobs) {

          if (tempMobs[key] === 'darkness') {

            tempMobs[key] = {type: 'dark', buttons: [{label:'refresh light', command:'refreshLight'}]};

          } else {

            // split into individual mobs
            tempMobs[key] = tempMobs[key].replace(/^\s*/, '').split(mobSplitRegexp);

            // split into label and command
            for (var idx = 0; idx < tempMobs[key].length; idx++) {

              var oMob = {label: tempMobs[key][idx].toLowerCase()};

              // remove first word as long as it isn't a name
              var id = oMob.label.replace(/^\s*([^A-Z]\S*)?\s+/,'')
                .replace(/(ves|ies|es|s)\b/g,'')
                .replace(/\s+(the|\w|\w\w)(?=\s+)/g,'')
                .replace(/[^a-zA-Z- ]+/g,'')
                .split(' ').join('.')
              ;


              oMob.command = (key !== 'here' ? key + ' & ' : '' ) + 'kill ' + id;
              tempMobs[key][idx] = oMob;

            }

            tempMobs[key] = {type: 'mobs', buttons: tempMobs[key]};

          }

        }


        // add any directions found in prompt, but not present in room.
        // lower case rooms in the prompt are "closed / locked / inaccesable"
        var aMatch = prompt.match(/<.*\s([NESWUD]*)>/i);
        if (aMatch){
          for (var i in aMatch[1]) {
            var dir = aMatch[1][i].toLowerCase();
            var direction = directions[dir];
            if (!tempMobs.hasOwnProperty(directions[dir])){
              if (dir !== aMatch[1][i]){
                tempMobs[directions[dir]] = {type: 'empty', buttons:[]};
              } else {
                tempMobs[directions[dir]] = {type: 'locked', buttons:[
                  {label: 'open ' + direction, command: 'open ' + direction + ' & scan'},
                  {label: 'unlock ' + direction, command: 'unlock ' + direction + ' & scan'},
                  {label: 'knock ' + direction, command: 'knock ' + direction + ' & scan'},
                  {label: 'pull lever', command: 'pull lever' + ' & scan'},
                  {label: 'pound gate', command: 'pound gate' + ' & scan'},
                  {label: 'move rubble', command: 'move rubble' + ' & scan'},
                  {label: 'open door', command: 'open door' + ' & scan'},
                  {label: 'unlock door', command: 'unlock door' + ' & scan'},
                  {label: 'knock door', command: 'knock door' + ' & scan'}
                ]};
              }
            }
          }
        }


        $scope.selectedDirection = '';
        $scope.adjacentRooms = tempMobs;

        tempMobs = {};
        bMatching = false;
        bUpdateNextPrompt = false;

        $timeout(function(){
          $scope.$apply('adjacentRooms');
        },0);

      }


    });



    // Public API here
    return {

      directionExists: function(direction) {
        direction = direction || $scope.selectedDirection;
        return $scope.adjacentRooms.hasOwnProperty(direction);
      },

      hasButtons: function(direction) {
        direction = direction || $scope.selectedDirection;
        return $scope.adjacentRooms.hasOwnProperty(direction) && ($scope.adjacentRooms[direction].buttons.length > 0);
      },

      getScope: function(){
        return $scope;
      },

      '$scope': $scope

    };

  }]);
