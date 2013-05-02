'use strict';

angular.module('clientApp')
  .directive('scanDirection', function () {
    return {
      templateUrl: 'templates/scanDirection.tpl.html',
      restrict: 'E',
      replace: false,
      scope: {
        direction: '@',
        mobs: '='
      }
    };
  });
