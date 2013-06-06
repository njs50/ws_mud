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

    var triggerChange = function() {
      $timeout(function(){
        $scope.$apply('aActiveButtons');
      },0);
    };

    var padButtons = function(aButtons) {
      if (aButtons.length < 12) {
        for(var i = aButtons.length; i < 12; i++) {
          aButtons.push({command:'', label:''});
        }
      }
      return aButtons;
    };


    $scope.aActiveButtons = padButtons(aUserCommands);
    $scope.buttonSet = '';


    // Public API here
    var _public = {
      '$scope': $scope,

      setDirectionButtons: function(direction) {
        var aButtons = autoscan.getButtons(direction);
        if (aButtons.length) {
          $scope.aActiveButtons = padButtons(aButtons);
          $scope.buttonSet = direction;
          triggerChange();
        }
      },

      resetButtons: function() {
        if ($scope.buttonSet !== '') {
          $scope.aActiveButtons = padButtons(aUserCommands);
          $scope.buttonSet = '';
          triggerChange();
        }
      }

    };

    return _public;

  }]);
