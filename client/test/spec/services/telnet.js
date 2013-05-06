'use strict';

describe('Service: telnet', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var telnet, scope;

  beforeEach(inject(function (_telnet_) {
    telnet = _telnet_;
    scope = telnet.getScope();
  }));

  it('should do something', function () {
    expect(!!telnet).toBe(true);
  });


  it('should not be connected yet', function(){
    expect(scope.bConnected).toBe(false);
  });


  it('should be able to connect to a telnet server via websocket', function() {
    telnet.connect('vault-thirteen.net',8000);

    expect(scope.bConnected).toBe(true);

  });






});
