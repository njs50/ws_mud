'use strict';

angular.module('clientApp')
  .controller('EditButtonsCtrl', ['$scope', 'profile', '$location', 'buttons', function ($scope, profile, $location, buttons) {

    $scope.buttons = buttons;
    $scope.activeButtons = profile.getButtons('default');

    var buttonBackup = angular.copy($scope.activeButtons);

    $scope.done = function() {
      $location.path('/');
    };

    $scope.undo = function() {
      $scope.activeButtons = angular.copy(buttonBackup);
    };

  }]);
