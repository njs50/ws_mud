'use strict';

describe('Service: map', function () {

  // load the service's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  // instantiate service
  var map, telnet, $rootScope;
  beforeEach(inject(function (_map_,_telnet_,_$rootScope_) {
    map = _map_;
    telnet = _telnet_;
    $rootScope = _$rootScope_;
  }));

  it('should parse any maps displayed to the user', function () {

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

    expect(map.$scope.aMap).toEqual([
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

    expect(map.$scope.aMap[map.$scope.posY][map.$scope.posX]).toBe('*');

  });

});


/*

You survey the area, then consult your atlas:

      O-O-O-O     O-O+>   O-O     Key:
          |       | + |   | |
        O-O     O-O > O > O-O     *  you
        |       | |     |   |     O  room
        O     O-O-O-O-O O-> O     ?  overlap
        |     +   | | | +   |     +  door
        O O-O-*   O-O-O-O-O-O     |  ns exit
        | |       | |             -  ew exit
O-O     O O       O-O             >  up exit
  |     | |                       <  down exit
  O   O-O-O-O-O-O                 X  u&d exit
  |             |                 (Field)
  O-O     O-O   O       O-O-O     (Forest)

<B|447hp 553e 155mv 155wm 6418920xp NW>

15w x 7h
*/
