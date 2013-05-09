'use strict';

describe('Service: telnet', function() {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var telnet, scope;


  beforeEach(inject(function(_telnet_) {
    telnet = _telnet_;
    scope = telnet.getScope();
  }));

  it('should do something', function() {
    expect( !! telnet).toBe(true);
  });


  it('should not be connected yet', function() {
    expect(scope.bConnected).toBe(false);
  });


  // this is more of an end to end test.
  // only going to work against my test server, so not really that great
  // also takes a while to run, probably want to disable it by changing
  // the describe below to xdescribe
  xdescribe('tests with an actual connection', function() {

    var bProvidedUser = false;
    var bProvidedPassword = false;
    var nPromptsRecieved = 0;
    var bDisconnected = false;
    var bConnected = false;

    // connection attempt + do some stuff + disconnect
    runs(function() {

      telnet.connect('vault-thirteen.net', 8000);

      // listen for a parse prompt event and then respond if required...
      scope.$on(scope.telnetEvents.parsePrompt, function(e, prompt) {

        // reply to username prompt
        if (prompt.match(/Choice:/)) {
          telnet.send('TestUnit');
          bProvidedUser = true;
        }

        // reply to password prompt
        if (prompt.match(/Password:/)) {
          telnet.send('TestPassword');
          bProvidedPassword = true;
        }

        // reply to continue/disconnect prompts
        if (prompt.match(/Press <return> to continue./)) {
          telnet.send('');
        }
        if (prompt.match(/Disconnect previous link?/)) {
          telnet.send('y');
        }

        // reply to the first three blank prompts with different commands
        if (prompt.match(/^\s*<[^>]*>\s*$/)) {
          nPromptsRecieved++;
          switch (nPromptsRecieved) {
          case 1:
            telnet.send('color');
            break;
          case 2:
            telnet.send('note');
            break;
          case 3:
            telnet.send('quit');
            break;
          }
        }

        // reply to any 'next page' prompts
        if (prompt.match(/^\s*-- MORE --/)) {
          telnet.send('');
        }

      });

      // listen for the connect event
      scope.$on(scope.telnetEvents.disconnect, function() {
        bConnected = true;
      });

      // listen for the disconnect event
      scope.$on(scope.telnetEvents.disconnect, function() {
        bDisconnected = true;
      });

    });

    // wait for the connection to be concluded
    waitsFor(function() {
      return bDisconnected;
    }, 'the connection to be concluded', 5000);


    it('should have connected at least once', function() {
      expect(bConnected).toBe(true);
    });

    it('should have provided a username', function() {
      expect(bProvidedUser).toBe(true);
    });

    it('should have provided a password', function() {
      expect(bProvidedPassword).toBe(true);
    });

    it('should have recieved more than two regular prompts', function() {
      expect(nPromptsRecieved).toBeGreaterThan(2);
    });

    it('should have disconnected at the end of the session', function() {
      expect(scope.bConnected).toBe(false);
      expect(bDisconnected).toBe(true);
    });


  });


});