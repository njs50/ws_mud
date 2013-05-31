'use strict';

var testHelpers = (function(){

  var bToggleKeyCode = false;

  var _public = {

    createKeyEvent: function(mainKey, alt, ctrl, shif) {
      var keyEvent = jQuery.Event('keydown');

      keyEvent.keyCode = mainKey;
      keyEvent.which = mainKey;
      keyEvent.altKey = alt || false;
      keyEvent.ctrlKey = ctrl || false;
      keyEvent.shiftKey = shif || false;

      return keyEvent;
    },

    // returns true if something was flushed, false otherwise
    flush: function() {

      // Request any dependency from the injector
      var $timeout;

      inject(function(_$timeout_){
        $timeout = _$timeout_;
      });

      try {
        $timeout.flush();
      } catch(e) {
        return false;
      }
      return true;
    }

  };

  return _public;

})();