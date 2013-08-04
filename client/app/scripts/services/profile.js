'use strict';

angular.module('clientApp')
  .factory('profile', [function () {
    // Service logic
    // ...

    var buttons;

    // defaults
    var defaults = {

      buttons: {
        standing: [
          {label: 'look', command: 'look & scan'},
          {label: 'skin corpse', command: 'skin corpse'},
          {label: 'score', command: 'score'},
          {label: 'inventory', command: 'inventory'},
          {label: 'drink water', command: 'drink water'},
          {label: 'eat food', command: 'eat food'}
        ],
        combat: [
          {label: 'kick', command: 'kick'},
          {label: 'punch', command: 'punch'}
        ],
        sleeping: [
          {label: 'stand', command: 'stand'},
          {label: 'score', command: 'score'},
          {label: 'notes', command: 'note summary'}
        ]

      }

    };



    var _private = {

      get: function(key) {
        var oTemp = $.jStorage.get(key);
        return oTemp ? JSON.parse(oTemp) : defaults[key];
      }

    };



    // Public API here
    var _public =  {

      getButtonSets: function(){
        var aSet = [];
        for (var key in buttons) {
          if (buttons.hasOwnProperty(key)) {
            aSet.push(key);
          }
        }
        return aSet;
      },

      getButtons: function(buttonSet){
        if(!buttons.hasOwnProperty(buttonSet)) {
          buttons[buttonSet] = [];
        }
        return buttons[buttonSet];
      },

      resetButtonsToDefault: function() {
        buttons = angular.extend({},defaults.buttons);
      },

      save: function() {
        $.jStorage.set('buttons',JSON.stringify(buttons));
      },

      load: function() {
        buttons = _private.get('buttons');
      }

    };


    // init code here...
    _public.load();


    return _public;

  }]);
