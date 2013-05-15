'use strict';

angular.module('clientApp')
  .factory('keypress', ['$rootScope',function ($rootScope) {
    // Service logic
    // ...

    var $scope = $rootScope.$new();

    var events = {
      keydown: 'UNHANDLED_KEY_DOWN'
    };

    // Public API here
    return {

      keyDown: function (e) {
        $scope.$broadcast(events.keydown,e);
      },

      getEventKey: function(e) {

        var code = e.keyCode ? e.keyCode : e.which;

        switch(code) {
        case 8:
          return 'backspace';
        case 9:
          return 'tab';
        case 13:
          return 'enter';
        case 27:
          return 'esc';
        case 32:
          return 'space';
        case 33:
          return 'pageup';
        case 34:
          return 'pagedown';
        case 35:
          return 'end';
        case 36:
          return 'home';
        case 37:
          return 'left';
        case 38:
          return 'up';
        case 39:
          return 'right';
        case 40:
          return 'down';
        case 45:
          return 'insert';
        case 46:
          return 'delete';
        case 192:
          return 'tilde';

        }

        if (code >= 48 && code <= 57) {
          return code - 48;
        }

        return 'unknown';
      },

      '$scope': $scope,

      events: events

    };
  }]);
