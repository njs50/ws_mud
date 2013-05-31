'use strict';

angular.module('clientApp')
  .factory('buttons', ['$rootScope', 'autoscan', '$timeout',
    function ($rootScope,autoscan, $timeout) {
    // Service logic
    // ...

    var aUserCommands = [
      {label: 'fireball', command: 'cast fireball'},
      {label: 'lightning', command: 'cast lightning bolt'},
      {label: 'acid blast', command: 'cast acid blast'},
      {label: 'mists', command: 'cast mists of sleep'},
      {label: 'freeze', command: 'cast freeze'}
    ];


    var $scope = $rootScope.$new();

    $scope.aActiveButtons = aUserCommands;
    $scope.buttonSet = '';


    var triggerChange = function() {
      $timeout(function(){
        $scope.$apply('aActiveButtons');
      },0);
    };


    // Public API here
    var _public = {
      '$scope': $scope,

      setDirectionButtons: function(direction) {
        var aButtons = autoscan.getButtons(direction);
        if (aButtons.length) {
          $scope.aActiveButtons = aButtons;
          $scope.buttonSet = direction;
          triggerChange();
        }
      },

      resetButtons: function() {
        if ($scope.buttonSet !== '') {
          $scope.aActiveButtons = aUserCommands;
          $scope.buttonSet = '';
          triggerChange();
        }
      }

    };

    return _public;

  }]);
