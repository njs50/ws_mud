'use strict';

describe('Controller: CommandButtonsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var CommandButtonsCtrl,
    scope,
    telnet,
    keypress;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _telnet_, _keypress_) {
    scope = $rootScope.$new();
    telnet = _telnet_;
    keypress = _keypress_;

    CommandButtonsCtrl = $controller('CommandButtonsCtrl', {
      $scope: scope
    });

  }));

  it('should attach a list of userCommands to the scope', function () {
    expect(scope.buttons.$scope.aActiveButtons.length).toBe(12);
  });


  it('should send the command corresponding to the number key pressed', function(){


    // telnet.setConsoleOutput(true);

    spyOn(telnet,'send');

    // from helpers.js
    var keyEvent = testHelpers.createKeyEvent( '2'.charCodeAt(0) );
    keypress.keyDown(keyEvent);

    // should trigger command #9 (which doesn't exist)
    keyEvent = testHelpers.createKeyEvent( '0'.charCodeAt(0) );
    keypress.keyDown(keyEvent);

    // escape (shouldn't do anything)
    keyEvent = testHelpers.createKeyEvent( 27 );
    keypress.keyDown(keyEvent);

    expect(telnet.send).toHaveBeenCalledWith(scope.buttons.$scope.aActiveButtons[1].command);

    // only the first keypress had a button assigned to it
    expect(telnet.send.callCount).toBe(1);

  });



  it('should unbind keypress events it created when destroyed', function () {

    spyOn(telnet,'send');
    var keyEvent = testHelpers.createKeyEvent( '2'.charCodeAt(0) );

    keypress.keyDown(keyEvent);
    expect(telnet.send.callCount).toBe(1);

    scope.$destroy();

    keypress.keyDown(keyEvent);
    expect(telnet.send.callCount).toBe(1);

  });


  it('should repond to keys 0-9, - and = and convert them to the correct index', function () {

    spyOn(scope,'clickButton');

    keypress.keyDown(testHelpers.createKeyEvent( '2'.charCodeAt(0) ));
    expect(scope.clickButton).toHaveBeenCalledWith(1);

    keypress.keyDown(testHelpers.createKeyEvent( '0'.charCodeAt(0) ));
    expect(scope.clickButton).toHaveBeenCalledWith(9);

    keypress.keyDown(testHelpers.createKeyEvent(189));
    expect(scope.clickButton).toHaveBeenCalledWith(10);

    keypress.keyDown(testHelpers.createKeyEvent(187));
    expect(scope.clickButton).toHaveBeenCalledWith(11);

  });


});
