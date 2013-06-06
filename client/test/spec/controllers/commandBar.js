'use strict';

describe('Controller: CommandBarCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));


  var CommandBarCtrl, scope, keypress;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _keypress_) {
    scope = $rootScope.$new();
    keypress = _keypress_;
    CommandBarCtrl = $controller('CommandBarCtrl', {
      $scope: scope
    });
  }));

  var fakeKeypress =  function(keyCode, shiftkey) {
    shiftkey = shiftkey || false ;
    scope.keyDown({which:keyCode, shiftKey: shiftkey, preventDefault: function(){}});
  };


  it('should be able to take commands and store in the history', function () {

    expect(scope.aCommands.length).toBe(0);

    scope.command = 'command one';

    fakeKeypress(13);
    expect(testHelpers.flush()).toBe(true);

    expect(scope.aCommands.length).toBe(1);

  });


  it('should delete items that dont fit in the history', function () {

    scope.commandMaxLength = 3;

    scope.command = 'command one';
    // simulate enter keypress
    fakeKeypress(13);
    scope.command = 'command two';
    fakeKeypress(13);
    scope.command = 'command three';
    fakeKeypress(13);
    scope.command = 'command four';
    fakeKeypress(13);

    expect(scope.aCommands.length).toBe(3);

    expect(scope.aCommands[0]).toBe('command two');

  });

  it('should be able to scroll up and down through history', function () {

    scope.command = 'command one';
    fakeKeypress(13);
    scope.command = 'command two';
    fakeKeypress(13);
    scope.command = 'command three';
    fakeKeypress(13);

    expect(scope.command).toBe('');

    // simulate 'up + shift' keypress

    fakeKeypress(38,true);
    fakeKeypress(38,true);
    expect(testHelpers.flush()).toBe(true);

    expect(scope.command).toBe('command two');

    // simulate 'down + shift' keypress
    fakeKeypress(40,true);
    expect(scope.command).toBe('command three');

    fakeKeypress(40,true);
    expect(scope.command).toBe('');


  });


  it('should wrap the history if it goes past the end', function () {

    scope.command = 'command one';
    fakeKeypress(13);
    scope.command = 'command two';
    fakeKeypress(13);
    scope.command = 'command three';
    fakeKeypress(13);

    expect(scope.command).toBe('');

    // simulate up keypress
    fakeKeypress(38,true);
    fakeKeypress(38,true);
    fakeKeypress(38,true);

    expect(scope.command).toBe('command one');

    fakeKeypress(38,true);

    expect(scope.command).toBe('');

    fakeKeypress(38,true);

    expect(scope.command).toBe('command three');


  });


  it('history entries should not be added back to the history if entered again unchanged', function () {

    scope.command = 'command one';
    fakeKeypress(13);
    scope.command = 'command two';
    fakeKeypress(13);
    scope.command = 'command three';
    fakeKeypress(13);

    expect(scope.command).toBe('');

    // simulate up keypress
    fakeKeypress(38,true);
    fakeKeypress(38,true);

    fakeKeypress(13);

    expect(scope.aCommands.length).toBe(3);

  });

  it('should pass on any keypresses that need to be handled elsewhere', function () {

    spyOn(keypress,'keyDown');

    // try pressing every key under the sun
    for(var i=9; i<= 193; i++) {
      fakeKeypress(i);
    }

    expect(keypress.keyDown.callCount).toBe(21);

  });


  it('should not pass on some keypresses when text has been entered', function () {

    spyOn(keypress,'keyDown');

    // try pressing every key under the sun
    for(var i=9; i<= 193; i++) {
      scope.command = 'test';
      fakeKeypress(i);
    }

    // only esc, page up/down, tab, up / down get passed through when command text is entered
    expect(keypress.keyDown.callCount).toBe(6);

  });





});
