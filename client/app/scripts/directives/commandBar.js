'use strict';

angular.module('clientApp')
  .directive('commandBar', function () {

    var keysByCode = {
      8: 'backspace',
      9: 'tab',
      13: 'enter',
      27: 'esc',
      32: 'space',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      45: 'insert',
      46: 'delete'
    };

    return {
      template: '<input ng-controller="CommandBarCtrl" ng-model="command" type="text" class="span12 allow-focus">',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element) {

        // bind the keydown event and prevent default where relevant
        element.bind('keydown', function (event) {

          switch(keysByCode[event.which]) {

          case 'enter':
            event.preventDefault();
            scope.enterCommand(event);
            break;

          case 'up':
          case 'down':
            event.preventDefault();
            scope.historyCommand(event);
            break;

          }

        });

      }
    };
  });
