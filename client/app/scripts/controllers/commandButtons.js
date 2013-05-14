'use strict';

angular.module('clientApp')
  .controller('CommandButtonsCtrl', ['$scope', 'autoscan', function ($scope,autoscan) {

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


  }]);
