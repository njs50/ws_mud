'use strict';

angular.module('clientApp')

  .controller('ScanCtrl', ['$scope', 'autoscan', 'telnet', 'keypress', function($scope,autoscan,telnet,keypress) {

    $scope.autoscanScope = autoscan.getScope();
    $scope.autoscan = autoscan;


    var keyToDirection = function(key) {

      switch(key) {
      case 'up':
        return 'north';
      case 'tilde':
        return 'here';
      case 'down':
        return 'south';
      case 'left':
        return 'west';
      case 'right':
        return 'east';
      case 'pageup':
        return 'up';
      case 'pagedown':
        return 'down';
      case 'tab':
        return 'refresh';
      }

      return '';

    };


    keypress.$scope.$on(keypress.events.keydown,function(ngevent, e){
      var key = keypress.getEventKey(e);
      var dir = keyToDirection(key);
      if(dir !== '') {
        $scope.directionClick(dir);
      } else if ($scope.autoscanScope.selectedDirection !== '' &&
        typeof key === 'number') {
        key--;

        dir = $scope.autoscanScope.selectedDirection;

        if(autoscan.directionExists() && autoscan.$scope.adjacentRooms[dir].buttons.length > key) {

          var oButton = autoscan.$scope.adjacentRooms[dir].buttons[key];

          telnet.send(oButton.command);

        }
      }
    });


    $scope.directionClick = function(direction) {

      if (direction === 'refresh') {
        telnet.send('scan');
        $scope.autoscanScope.selectedDirection = '';
        $scope.autoscanScope.$apply('selectedDirection');
      } else {
        if ($scope.autoscanScope.selectedDirection === direction || !$scope.autoscan.hasButtons(direction) ){
          if (direction !== 'here') {
            telnet.send(direction);
          }
        } else if ($scope.autoscanScope.selectedDirection !== direction){
          $scope.autoscanScope.selectedDirection = direction;
          $scope.autoscanScope.$apply('selectedDirection');
        }
      }
    };

  }]);

