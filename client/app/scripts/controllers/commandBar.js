'use strict';

angular.module('clientApp')
  .controller('CommandBarCtrl', ['$scope', 'telnet', '$timeout', 'keypress', function ($scope, telnet, $timeout, keypress) {

    $scope.command = '';
    $scope.aCommands = [];
    $scope.commandPos = 0;
    $scope.commandMaxLength = 50;

    $scope.enterCommand = function() {

      // if this command came from the history don't add it to the history
      if ($scope.commandPos === 0 || $scope.aCommands[$scope.aCommands.length - $scope.commandPos] !== $scope.command ){
        $scope.aCommands.push($scope.command);
      }

      $scope.commandPos = 0;

      if ($scope.aCommands.length > $scope.commandMaxLength) {
        $scope.aCommands = $scope.aCommands.slice(1);
      }

      telnet.send($scope.command);
      $scope.command = '';

      $timeout(function(){
        $scope.$apply('command');
      }, 0);

    };


    var historyCommand = function(e) {

      $scope.historyChange(39 - e.which);

    };

    $scope.historyChange = function(dir) {
    // don't go below zero (i.e if they go down from 0, and if they go up from max reset to 0)
      $scope.commandPos = Math.max(0,($scope.commandPos + dir )) % ($scope.aCommands.length + 1);

      if ($scope.commandPos) {
        $scope.command = $scope.aCommands[$scope.aCommands.length - $scope.commandPos];
      } else {
        $scope.command = '';
      }

      $timeout(function(){
        $scope.$apply('command');
      }, 0);
    };

    // redirect any keypresses that need to be handled elsewhere

    $scope.keyDown = function(e) {

      var code = (e.keyCode ? e.keyCode : e.which);

      switch(code) {

      //enter
      case 13:
        e.preventDefault();
        $scope.enterCommand();
        break;

      // esc, page up/down,
      case 27:
      case 33:
      case 34:
        keypress.keyDown(e);
        break;

      // up/down
      case 38:
      case 40:
        if(e.shiftKey){
          e.preventDefault();
          historyCommand(e);
        } else {
          e.preventDefault();
          keypress.keyDown(e);
        }
        break;

      // prevent tabbing out of the input field
      case 9:
        e.preventDefault();
        keypress.keyDown(e);
        break;

      default:
        // if no text has been entered then 0 - 9 are passed to the command handler
        // as are left/right and tilde
        if ($scope.command === ''){
          if ((code >= 48 && code <= 57) || code === 192 || code === 37 || code === 39) {
            e.preventDefault();
            keypress.keyDown(e);
          }
        }

      }

    };

  }]);


