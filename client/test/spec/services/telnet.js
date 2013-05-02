'use strict';

describe('Service: telnet', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var telnet;
  beforeEach(inject(function (_telnet_) {
    telnet = _telnet_;
  }));

  it('should do something', function () {
    expect(!!telnet).toBe(true);
  });


  it('should do find the meaning of life', function () {
    expect(telnet.someMethod()).toBe(42);
  });



});
