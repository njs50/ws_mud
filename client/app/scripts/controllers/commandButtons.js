'use strict';

angular.module('clientApp')
  .controller('CommandButtonsCtrl',
    ['$scope', 'buttons', 'telnet', 'keypress', function ($scope, buttons, telnet,keypress) {

    $scope.buttons = buttons;

    keypress.$scope.$on(keypress.events.keydown,function(ngevent, e){

      var key = keypress.getEventKey(e);

      if (typeof key === 'number') {
        // convert key to index
        key --;
        // wrap 0 back around to 10
        if (key === -1) {
          key = 9;
        }
        $scope.clickButton(key);
      }

    });


    $scope.clickButton = function(key) {
      if(buttons.$scope.aActiveButtons.length > key) {
        telnet.send(buttons.$scope.aActiveButtons[key].command);
      }
      buttons.resetButtons();
    };


  }]);
