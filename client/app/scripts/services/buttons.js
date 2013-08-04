'use strict';

angular.module('clientApp')
  .factory('buttons', ['$rootScope', 'autoscan', 'profile', '$timeout',
    function ($rootScope,autoscan, profile, $timeout) {
    // Service logic
    // ...


    var $scope = $rootScope.$new();
    var buttonMode = 'profile';
    var profileSet = '';

    $scope.buttonSet = '';
    $scope.aActiveButtons = [];


    var triggerChange = function() {
      $timeout(function(){
        $scope.$apply('aActiveButtons');
      }, 0, false);
    };



    // Public API here
    var _public = {
      '$scope': $scope,

      setDirectionButtons: function(direction) {
        var aButtons = autoscan.getButtons(direction);
        if (aButtons.length) {
          buttonMode = 'direction';
          $scope.aActiveButtons = _public.padButtons(aButtons);
          $scope.buttonSet = direction;
          triggerChange();
        }
      },

      resetButtons: function() {
        _public.setProfileButtons(profileSet);
      },

      setProfileButtons: function(set) {
        if ($scope.buttonSet !== set || buttonMode !== 'profile') {
          buttonMode = 'profile';
          $scope.buttonSet = set;
          profileSet = set;
          $scope.aActiveButtons = _public.padButtons(profile.getButtons(set));
          triggerChange();
        }
      },

      indexToKey: function(index) {

        switch (index) {
        case 9:
          return 0;
        case 10:
          return '-';
        case 11:
          return '=';
        default:
          return index + 1;
        }

      },

      padButtons: function(aButtons) {
        if (aButtons.length < 12) {
          for(var i = aButtons.length; i < 12; i++) {
            aButtons.push({command:'', label:''});
          }
        }
        return aButtons;
      }

    };

    _public.setProfileButtons('standing');

    return _public;

  }]);
