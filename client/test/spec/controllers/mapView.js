'use strict';

describe('Controller: MapViewCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var MapViewCtrl, telnet, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _telnet_) {
    scope = $rootScope.$new();
    telnet = _telnet_;
    MapViewCtrl = $controller('MapViewCtrl', {
      $scope: scope
    });
  }));


  beforeEach(function(){

    telnet.relayLines(
      'You survey the area, then consult your atlas:\n' +
      '\n' +
      '      O-O-O-O     O-O+>   O-O     Key:\n' +
      '          |       | + |   |\n' +
      '        O-O     O-O > O > O-O     *  you\n' +
      '        |       | |     |   |     O  room\n' +
      '        O     O-O-O-O-O O-> O     ?  overlap\n' +
      '        |     +   | | | +   |     +  door\n' +
      '        O O-O-*   O-O-O-O-O-O     |  ns exit\n' +
      '        | |       | |             -  ew exit\n' +
      'O-O     O O       O-O             >  up exit\n' +
      '  |     | |                       <  down exit\n' +
      '  O   O-O-O-O-O-O                 X  u&d exit\n' +
      '  |             |                 (Field)\n' +
      '  O-O     O-O   O       O-O-O     (Forest)\n' +
      '\n'
    );

    telnet.relayPrompt('<20hp 53e 100mv 133wm 246909xp none>');

    testHelpers.flush();

  });


  it('should update when the map changes', function(){

    expect(scope.map.$scope.aMap).toEqual([
      '      O-O-O-O     O-O+>   O-O',
      '          |       | + |   |  ',
      '        O-O     O-O > O > O-O',
      '        |       | |     |   |',
      '        O     O-O-O-O-O O-> O',
      '        |     +   | | | +   |',
      '        O O-O-*   O-O-O-O-O-O',
      '        | |       | |        ',
      'O-O     O O       O-O        ',
      '  |     | |                  ',
      '  O   O-O-O-O-O-O            ',
      '  |             |            ',
      '  O-O     O-O   O       O-O-O'
    ]);

  });


  it('should attach the map service to the scope', function () {
    expect(!!scope.map.$scope.aMap).toBe(true);
  });

});
