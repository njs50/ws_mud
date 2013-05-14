'use strict';

describe('Service: autoscan', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var autoscan;
  beforeEach(inject(function (_autoscan_) {
    autoscan = _autoscan_;
  }));

  it('should do something', function () {
    expect(!!autoscan).toBe(true);
  });

});
