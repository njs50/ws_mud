'use strict';

describe('Service: autoscan', function () {

  // load the service's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  // instantiate service
  var autoscan, telnet;

  beforeEach(inject(function (_autoscan_, _telnet_) {
    autoscan = _autoscan_;
    telnet = _telnet_;
  }));

  it('should do something', function () {
    expect(!!autoscan).toBe(true);
  });


  it('should parse scan data between prompts', function(){

    telnet.relayPrompt('<20hp 53e 100mv 133wm 246909xp NEW>');
    telnet.relayLines('      [Here] : a Voaleth citizen\n' +
      '        east : a large, burly orc\n' +
      '        west : an aged troll, a Troll guard of Voaleth,\n' +
      '               a black horse with hooves and eyes of flame');

    telnet.relayPrompt('<20hp 53e 100mv 133wm 246909xp NEW>');

    expect(testHelpers.flush()).toBe(true);

    expect(autoscan.$scope.adjacentRooms).toEqual({
      here: {
        type: 'mobs',
        buttons: [{
          label: 'a voaleth citizen',
          command: 'kill voaleth.citizen'
        }]
      },
      east: {
        type: 'mobs',
        buttons: [{
          label: 'a large, burly orc',
          command: 'east & kill large.burly.orc'
        }]
      },
      west: {
        type: 'mobs',
        buttons: [{
          label: 'an aged troll',
          command: 'west & kill aged.troll'
        }, {
          label: 'a troll guard of voaleth',
          command: 'west & kill troll.guard.voaleth'
        }, {
          label: 'a black horse with hooves and eyes of flame',
          command: 'west & kill black.horse.with.hoo.and.flame'
        }]
      },
      north: {
        type: 'empty',
        buttons: []
      }
    });


  });

  it('should detect if a room is too dark', function(){

    telnet.relayLines('east : darkness');
    telnet.relayPrompt('<20hp 53e 100mv 10wm 100xp E>');

    expect(autoscan.$scope.adjacentRooms).toEqual({ east : {type: 'dark', buttons: [{label:'refresh light', command:'refreshLight'}]} });

  });




  it('should reset itself if there is a new room', function(){

    telnet.relayLines('You see nothing in the vicinity.');
    telnet.relayPrompt('<20hp 53e 100mv 10wm 100xp N>');

    expect(autoscan.$scope.adjacentRooms).toEqual({ north : { type : 'empty', buttons : [  ] } });

  });


  it('should detect a closed or locked door and provide opening options', function(){

    telnet.relayLines('east : darkness');
    telnet.relayPrompt('<20hp 53e 100mv 10wm 100xp Ew>');

    expect(autoscan.$scope.adjacentRooms.west.type).toEqual('locked');

    expect(autoscan.directionExists('west')).toBe(true);

    expect(autoscan.hasButtons('west')).toBe(true);

  });

  it('should handle requests for non existant directions', function(){

    telnet.relayLines('east : darkness');
    telnet.relayPrompt('<20hp 53e 100mv 10wm 100xp Ew>');

    expect(autoscan.directionExists('north')).toBe(false);
    expect(autoscan.hasButtons('north')).toBe(false);
    expect(autoscan.getButtons('north')).toEqual([]);

  });


  it('should reset itself if there is a new room', function(){

    telnet.relayLines('[Exits: w');
    telnet.relayPrompt('<20hp 53e 100mv 10wm 100xp w>');

    expect(autoscan.$scope.adjacentRooms.west.type).toEqual('locked');

  });

  it('should handle no exits from a room', function(){
    telnet.relayLines('[Exits: none');
    telnet.relayPrompt('<20hp 53e 100mv 10wm 100xp none>');
    expect(autoscan.$scope.adjacentRooms).toEqual({});

  });



  it('should reset itself if there is a new room', function(){

    telnet.relayLines('[Exits: w');
    telnet.relayPrompt('<20hp 53e 100mv 10wm 100xp w>');

    expect(autoscan.$scope.adjacentRooms.west.type).toEqual('locked');


  });



});
