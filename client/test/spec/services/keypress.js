'use strict';

describe('Service: keypress', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var keypress;
  beforeEach(inject(function (_keypress_) {
    keypress = _keypress_;
  }));

  it('should do something', function () {
    expect(!!keypress).toBe(true);
  });

  it('should be able to identify keycodes for keys used', function () {

    var oResult = {};
    for (var i=9; i< 58; i++) {
      oResult[keypress.getEventKey({which: i})] = true;
    }

    expect(oResult).toEqual({ '0': true,
      '1': true,
      '2': true,
      '3': true,
      '4': true,
      '5': true,
      '6': true,
      '7': true,
      '8': true,
      '9': true,
      unknown: true,
      tab: true,
      enter: true,
      esc: true,
      space: true,
      pageup: true,
      pagedown: true,
      left: true,
      up: true,
      right: true,
      down: true
    });

    expect(keypress.getEventKey({which: 192})).toBe('tilde');
    expect(keypress.getEventKey({which: 187})).toBe('equal');
    expect(keypress.getEventKey({which: 189})).toBe('minus');

  });

});
