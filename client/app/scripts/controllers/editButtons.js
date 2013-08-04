'use strict';

angular.module('clientApp')
  .controller('EditButtonsCtrl', ['$scope', 'profile', '$location', 'buttons', function ($scope, profile, $location, buttons) {

    $scope.buttons = buttons;
    $scope.aButtonSets = profile.getButtonSets();


    var buttonBackup = [];
    var loadSet = function(set) {
      $scope.activeButtons = buttons.padButtons(profile.getButtons(set));
      buttonBackup = angular.copy($scope.activeButtons);
    };

    $scope.buttonSet = 'standing';
    loadSet($scope.buttonSet);



    $scope.done = function() {
      $location.path('/');
    };

    $scope.undo = function() {
      $scope.activeButtons = angular.copy(buttonBackup);
    };

    $scope.reset = function() {

      if(confirm('Are you sure you want to reset ALL your button sets?')) {
        $scope.buttonSet = 'combat';
        profile.resetButtonsToDefault();
        $scope.buttonSet = 'standing';
      }

    };

    $scope.$watch('buttonSet',function(val){
      loadSet(val);
    });

  }]);
