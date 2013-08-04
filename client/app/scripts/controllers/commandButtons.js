'use strict';

angular.module('clientApp')
  .controller('CommandButtonsCtrl',
    ['$scope', 'buttons', 'telnet', 'keypress', 'playerStatus',
      function ($scope, buttons, telnet, keypress, playerStatus) {

    $scope.buttons = buttons;

    var unbindStatusWatch = playerStatus.$scope.$watch('playerState',function(state){
      buttons.setProfileButtons(state);
    });

    var unbindEvent = keypress.$scope.$on(keypress.events.keydown,function(ngevent, e){

      var key = keypress.getEventKey(e);
      var idx = -1;

      switch(key) {
      case 'minus':
        idx = 10;
        break;
      case 'equal':
        idx = 11;
        break;
      case 0:
        idx = 9;
        break;
      default:
        if (typeof key === 'number') {
          idx = key - 1;
        }
      }

      if (idx !== -1) {
        $scope.clickButton(idx);
      }

    });

    $scope.$on('$destroy', function(){
      unbindEvent();
      unbindStatusWatch();
    });

    $scope.clickButton = function(key) {
      if(buttons.$scope.aActiveButtons.length > key &&
        buttons.$scope.aActiveButtons[key].command.length) {
        telnet.send(buttons.$scope.aActiveButtons[key].command);
      }
      buttons.resetButtons();
    };

  }]);



