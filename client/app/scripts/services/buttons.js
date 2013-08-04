'use strict';

angular.module('clientApp')
  .factory('buttons', ['$rootScope', 'autoscan', 'profile', '$timeout',
    function ($rootScope,autoscan, profile, $timeout) {
    // Service logic
    // ...


    var $scope = $rootScope.$new();

    $scope.buttonMode = 'profile'; // profile or direction
    $scope.profileSet = ''; // last profile set to be used (so we can return to it)
    $scope.buttonType = ''; // if direction set, type of direction buttons

    $scope.buttonSet = ''; // active button set label (i.e north or combat)
    $scope.aActiveButtons = []; // current buttons


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
          $scope.buttonMode = 'direction';
          $scope.buttonType = autoscan.getButtonType(direction);
          $scope.buttonSet = direction;
          $scope.aActiveButtons = _public.padButtons(aButtons);
          triggerChange();
        }
      },

      resetButtons: function() {
        _public.setProfileButtons($scope.profileSet);
      },

      setProfileButtons: function(set) {
        if ($scope.buttonSet !== set || $scope.buttonMode !== 'profile') {
          $scope.buttonMode = 'profile';
          $scope.buttonType = 'user';
          $scope.buttonSet = set;
          $scope.aActiveButtons = _public.padButtons(profile.getButtons(set));
          $scope.profileSet = set;
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
