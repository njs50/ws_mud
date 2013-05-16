'use strict';

function createKeyEvent(mainKey, alt, ctrl, shif) {
  var keyEvent = jQuery.Event('keydown');

  keyEvent.keyCode = mainKey;
  keyEvent.which = mainKey;
  keyEvent.altKey = alt || false;
  keyEvent.ctrlKey = ctrl || false;
  keyEvent.shiftKey = shif || false;

  return keyEvent;
}