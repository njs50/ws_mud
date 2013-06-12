'use strict';

describe('Service: telnet', function () {

  // load the service's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  // instantiate service
  var telnet, scope;

  beforeEach(inject(function (_telnet_) {
    telnet = _telnet_;
    scope = telnet.$scope;
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


  it('should output to console.log when enabled', function() {
    telnet.setConsoleOutput(true);

    spyOn(console,'log');

    telnet.relayLines('hello 1');
    telnet.relayPrompt('hello 2');
    telnet.send('hello 3');

    expect(console.log).toHaveBeenCalledWith('telnet output: hello 1');
    expect(console.log).toHaveBeenCalledWith('telnet prompt: hello 2');
    expect(console.log).toHaveBeenCalledWith('telnet send: hello 3');

  });


});
