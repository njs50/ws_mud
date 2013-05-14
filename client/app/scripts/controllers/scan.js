'use strict';

angular.module('clientApp')

  .controller('ScanCtrl', ['$scope', 'autoscan', 'telnet', function($scope,autoscan,telnet) {

    $scope.autoscanScope = autoscan.getScope();
    $scope.autoscan = autoscan;

    $scope.directionClick = function(direction) {
      if ($scope.autoscanScope.selectedDirection === direction || !$scope.autoscan.containsMobs(direction) ){
        telnet.send(direction);
      } else if ($scope.autoscanScope.selectedDirection !== direction){
        $scope.autoscanScope.selectedDirection = direction;
        $scope.autoscanScope.$apply('selectedDirection');
      }
    };

    $scope.attack = function(idx) {
      idx--;

      var dir = $scope.autoscanScope.selectedDirection;

      if(autoscan.directionExists(dir) &&
          $scope.autoscanScope.adjacentMobs[dir].length >= idx) {

        var mob = $scope.autoscanScope.adjacentMobs[dir][idx];

        // remove article at start of name
        // remove any plural bits (.ie ent(s), dwar(ves), thing(es), fair(ies) )
        // delete the or any one or two letter words remaining
        // get rid of anything that isn't a letter or a space or a dash
        var id = mob.replace(/^\s*\S+\s+/,'')
          .replace(/(ves|ies|es|s)\b/g,'')
          .replace(/\s+(the|\w|\w\w)(?=\s+)/g,'')
          .replace(/[^a-zA-Z- ]+/g,'')
          .split(' ').join('.')
        ;

        telnet.send(dir + ' & kill ' + id);
      }

    };

  }]);

