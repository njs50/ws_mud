'use strict';

describe('Controller: CommandBarCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var CommandBarCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommandBarCtrl = $controller('CommandBarCtrl', {
      $scope: scope
    });
  }));



  it('should be able to take commands and store in the history', function () {

    expect(scope.aCommands.length).toBe(0);

    scope.command = 'command one';
    scope.enterCommand();

    expect(scope.aCommands.length).toBe(1);

  });


  it('should delete items that dont fit in the history', function () {

    scope.commandMaxLength = 3;

    scope.command = 'command one';
    scope.enterCommand();
    scope.command = 'command two';
    scope.enterCommand();
    scope.command = 'command three';
    scope.enterCommand();
    scope.command = 'command four';
    scope.enterCommand();

    expect(scope.aCommands.length).toBe(3);

    expect(scope.aCommands[0]).toBe('command two');

  });

  it('should be able to scroll up and down through history', function () {

    scope.command = 'command one';
    scope.enterCommand();
    scope.command = 'command two';
    scope.enterCommand();
    scope.command = 'command three';
    scope.enterCommand();

    expect(scope.command).toBe('');

    // simulate up keypress
    scope.historyCommand({which: 38});
    scope.historyCommand({which: 38});

    expect(scope.command).toBe('command two');

    // simulate down keypress
    scope.historyCommand({which: 40});
    expect(scope.command).toBe('command three');

    scope.historyCommand({which: 40});
    expect(scope.command).toBe('');


  });


  it('should wrap the history if it goes past the end', function () {

    scope.command = 'command one';
    scope.enterCommand();
    scope.command = 'command two';
    scope.enterCommand();
    scope.command = 'command three';
    scope.enterCommand();

    expect(scope.command).toBe('');

    // simulate up keypress
    scope.historyCommand({which: 38});
    scope.historyCommand({which: 38});
    scope.historyCommand({which: 38});

    expect(scope.command).toBe('command one');

    scope.historyCommand({which: 38});

    expect(scope.command).toBe('');

    scope.historyCommand({which: 38});

    expect(scope.command).toBe('command three');


  });


  it('history entries should not be added back to the history if entered again unchanged', function () {

    scope.command = 'command one';
    scope.enterCommand();
    scope.command = 'command two';
    scope.enterCommand();
    scope.command = 'command three';
    scope.enterCommand();

    expect(scope.command).toBe('');

    // simulate up keypress
    scope.historyCommand({which: 38});
    scope.historyCommand({which: 38});

    scope.enterCommand();

    expect(scope.aCommands.length).toBe(3);

  });





});
