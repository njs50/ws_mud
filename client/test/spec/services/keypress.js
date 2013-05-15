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

});
