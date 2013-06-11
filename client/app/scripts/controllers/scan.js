'use strict';

angular.module('clientApp')

  .controller('ScanCtrl', ['$scope', 'autoscan', 'buttons', 'keypress', 'telnet',
    function($scope, autoscan, buttons, keypress, telnet) {


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
      case 'esc':
        return 'reset';
      }

      return '';

    };

    var e1 = keypress.$scope.$on(keypress.events.keydown,function(ngevent, e){

      var key = keypress.getEventKey(e);
      var dir = keyToDirection(key);

      // watch for command button keys being pressed
      if(dir !== '') {
        $scope.directionClick(dir);
      }

    });

    var e2 = autoscan.$scope.$on(autoscan.events.room_changed, function(){
      buttons.resetButtons();
    });

    $scope.$on('$destroy', function(){
      e1();
      e2();
    });

    $scope.directionClick = function(direction) {

      // esc = reset the buttons to default
      if (direction === 'reset') {
        buttons.resetButtons();
      // tab/refresh click = scan + reset
      } else if (direction === 'refresh') {
        buttons.resetButtons();
        telnet.send('scan');
      // other buttons
      } else {
        // if they have clicked a direction for the second time, then move (+reset buttons)
        if (buttons.$scope.buttonSet === direction || !autoscan.hasButtons(direction) ){
          if (direction !== 'here') {
            telnet.send(direction);
          }
        } else if (buttons.$scope.buttonSet !== direction){
          buttons.setDirectionButtons(direction);
        }
      }

    };

  }]);

