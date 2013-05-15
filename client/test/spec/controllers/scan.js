'use strict';

describe('Controller: ScanCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var ScanCtrl,
    telnet,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _telnet_) {
    scope = $rootScope.$new();
    telnet = _telnet_;
    ScanCtrl = $controller('ScanCtrl', {
      $scope: scope
    });
  }));



  it('should parse scan data between prompts', function(){

    telnet.relayPrompt('<20hp 53e 100mv NEW>');
    telnet.relayLines('      [Here] : a Voaleth citizen\n' +
      '        east : a large, burly orc\n' +
      '        west : an aged troll, a Troll guard of Voaleth,\n' +
      '               a black horse with hooves and eyes of flame');

    telnet.relayPrompt('<20hp 53e 100mv NEW>');

    expect(scope.adjacentRooms).toEqual({
      'here': ['a voaleth citizen'],
      'east': ['a large, burly orc'],
      'north': [],
      'west': ['an aged troll', 'a troll guard of voaleth','a black horse with hooves and eyes of flame']
    });


  });



  it('should reset itself if there is a new room', function(){

    telnet.relayLines('You see nothing in the vicinity.');
    telnet.relayPrompt('<20hp 53e 100mv N>');

    expect(scope.adjacentRooms).toEqual({north:[]});

  });


  it('should reset itself if there is a new room', function(){

    telnet.relayLines('[Exits: NESW');
    telnet.relayPrompt('<20hp 53e 100mv W>');

    expect(scope.adjacentRooms).toEqual({west:[]});

  });






});
