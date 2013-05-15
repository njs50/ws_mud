'use strict';

angular.module('clientApp')
  .controller('CommandButtonsCtrl',
    ['$scope', 'autoscan', 'keypress', 'telnet', function ($scope,autoscan,keypress,telnet) {

    $scope.autoscanScope = autoscan.getScope();

    $scope.aUserCommands = [
      'cast fireball',
      'cast lightning bolt',
      'cast prismatic missile',
      'cast acid blast',
      'cast burning hands',
      'cast mists of sleep',
      'cast freeze',
      'cast maelstrom',
      'cast web',
      'cast slow',
      'cast proble',
      'prep prismatic missile',
      'prep maelstrom'
    ];

    keypress.$scope.$on(keypress.events.keydown,function(ngevent, e){

      if ($scope.autoscanScope.selectedDirection === '') {

        var key = keypress.getEventKey(e);

        if (typeof key === 'number') {
          // convert key to index
          key --;
          // wrap 0 back around to 10
          if (key === -1) {
            key = 9;
          }
          telnet.send($scope.aUserCommands[key]);
        }

      }

    });


  }]);
