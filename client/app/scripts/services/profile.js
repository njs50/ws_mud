'use strict';

angular.module('clientApp')
  .factory('profile', [function () {
    // Service logic
    // ...

    var buttons;

    // defaults
    var defaults = {

      buttons: {
        default: [
          {label: 'look', command: 'look & scan'},
          {label: 'skin corpse', command: 'skin corpse'},
          {label: 'score', command: 'score'},
          {label: 'inventory', command: 'inventory'},
          {label: 'drink water', command: 'drink water'},
          {label: 'eat food', command: 'eat food'}
        ]
      }

    };



    var _private = {

      save: function() {
        $.jStorage.set('buttons',JSON.stringify(buttons));
      },

      load: function() {
        buttons = _private.get('buttons');
      },

      get: function(key) {
        var oTemp = $.jStorage.get(key);
        return oTemp ? JSON.parse(oTemp) : defaults[key];
      }

    };



    // Public API here
    var _public =  {

      getButtons: function(buttonSet){
        if(buttons.hasOwnProperty(buttonSet)) {
          return buttons[buttonSet];
        } else {
          return [];
        }
      },

      setButtons: function(buttonSet, aButtons) {
        buttons[buttonSet] = aButtons;
      },

      save: function() {
        _private.save();
      }

    };


    // init code here...
    _private.load();


    return _public;

  }]);
