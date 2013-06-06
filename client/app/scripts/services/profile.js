'use strict';

angular.module('clientApp')
  .factory('profile', ['$rootScope', function ($rootScope) {
    // Service logic
    // ...

    var buttons = {

      default: [
        {label: 'fireball', command: 'cast fireball'},
        {label: 'lightning', command: 'cast lightning bolt'},
        {label: 'acid blast', command: 'cast acid blast'},
        {label: 'mists', command: 'cast mists of sleep'},
        {label: 'freeze', command: 'cast freeze'}
      ]

    };

    // Public API here
    return {

      getButtons: function(buttonSet){
        if(buttons.hasOwnProperty(buttonSet)) {
          return buttons[buttonSet];
        } else {
          return [];
        }
      },

      setButtons: function(buttonSet, aButtons) {
        buttons[buttonSet] = aButtons;
      }

    };
  }]);
