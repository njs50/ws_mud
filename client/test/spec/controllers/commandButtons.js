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
    expect(scope.aUserCommands.length).toBe(13);
  });


  it('should send the command corresponding to the number key pressed', function(){

    // from helpers.js
    var keyEvent = createKeyEvent( '2'.charCodeAt(0) );

    spyOn(telnet,'send');

    keypress.keyDown(keyEvent);

    expect(telnet.send).toHaveBeenCalled();

  });

});
