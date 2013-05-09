'use strict';

angular.module('clientApp')
  .controller('CommandBarCtrl', ['$scope', 'telnet', function ($scope, telnet) {

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

      $scope.$apply('command');

    };


    $scope.historyCommand = function(event) {

      // don't go below zero (i.e if they go down from 0, and if they go up from max reset to 0)
      $scope.commandPos = Math.max(0,($scope.commandPos + (39 - event.which) )) % ($scope.aCommands.length + 1);

      if ($scope.commandPos) {
        $scope.command = $scope.aCommands[$scope.aCommands.length - $scope.commandPos];
      } else {
        $scope.command = '';
      }

      $scope.$apply('command');

    };

  }]);


