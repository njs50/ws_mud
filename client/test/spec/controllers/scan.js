'use strict';

describe('Controller: ScanCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var ScanCtrl,
    telnet,
    buttons,
    autoscan,
    keypress,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _telnet_, _buttons_, _autoscan_, _keypress_) {
    scope = $rootScope.$new();
    telnet = _telnet_;
    buttons = _buttons_;
    autoscan = _autoscan_;
    keypress = _keypress_;
    ScanCtrl = $controller('ScanCtrl', {
      $scope: scope
    });

    autoscan.$scope.adjacentRooms = {
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
      north: {
        type: 'empty',
        buttons: []
      }
    };

  }));


  // should be triggered when direction buttons are pressed
  it('pressing the bound keys should trigger the directionClick events', function(){

    spyOn(scope,'directionClick');

    // testHelpers.createKeyEvent from helpers.js

    // page up
    var keyEvent = testHelpers.createKeyEvent(33);
    keypress.keyDown(keyEvent);
    // page down
    keyEvent =   testHelpers.createKeyEvent(34);
    keypress.keyDown(keyEvent);
    // right
    keyEvent =   testHelpers.createKeyEvent(39);
    keypress.keyDown(keyEvent);
    // left
    keyEvent =   testHelpers.createKeyEvent(37);
    keypress.keyDown(keyEvent);
    // up
    keyEvent =   testHelpers.createKeyEvent(38);
    keypress.keyDown(keyEvent);
    // down
    keyEvent =   testHelpers.createKeyEvent(40);
    keypress.keyDown(keyEvent);
    // tilde
    keyEvent =   testHelpers.createKeyEvent(192);
    keypress.keyDown(keyEvent);
    // tab
    keyEvent =   testHelpers.createKeyEvent(9);
    keypress.keyDown(keyEvent);
    // esc
    keyEvent =   testHelpers.createKeyEvent(27);
    keypress.keyDown(keyEvent);
    // enter : shouldn't do anything
    keyEvent = testHelpers.createKeyEvent(13);
    keypress.keyDown(keyEvent);

    expect(scope.directionClick).toHaveBeenCalledWith('up');
    expect(scope.directionClick).toHaveBeenCalledWith('down');
    expect(scope.directionClick).toHaveBeenCalledWith('east');
    expect(scope.directionClick).toHaveBeenCalledWith('west');
    expect(scope.directionClick).toHaveBeenCalledWith('north');
    expect(scope.directionClick).toHaveBeenCalledWith('south');
    expect(scope.directionClick).toHaveBeenCalledWith('here');
    expect(scope.directionClick).toHaveBeenCalledWith('refresh');
    expect(scope.directionClick).toHaveBeenCalledWith('reset');

    // enter keypress above should not have triggered this
    expect(scope.directionClick.callCount).toBe(9);

  });



  it('should trigger the buttons to reset if a room change is detected', function(){
    spyOn(buttons,'resetButtons');
    autoscan.$scope.$broadcast(autoscan.events.room_changed);
    expect(buttons.resetButtons).toHaveBeenCalled();
  });


  it('should trigger the buttons to reset if the reset key (esc) is pressed', function(){
    spyOn(buttons,'resetButtons');
    scope.directionClick('reset');
    expect(buttons.resetButtons).toHaveBeenCalled();
  });


  it('should trigger the buttons to reset and send the scan command if the refresh key (tab) is pressed', function(){
    spyOn(buttons,'resetButtons');
    spyOn(telnet,'send');
    scope.directionClick('refresh');
    expect(buttons.resetButtons).toHaveBeenCalled();
    expect(telnet.send).toHaveBeenCalledWith('scan');
  });


  it('should send a direction command if there are no buttons for a direction that was pressed', function(){
    spyOn(telnet,'send');
    scope.directionClick('north');
    scope.directionClick('west');
    expect(telnet.send).toHaveBeenCalledWith('north');
    expect(telnet.send).toHaveBeenCalledWith('west');
  });

  it('should update the buttons if buttons exist for a pressed direction and not send the direction', function(){

    spyOn(telnet,'send');
    scope.directionClick('east');
    expect(telnet.send).not.toHaveBeenCalled();
    expect(buttons.$scope.aActiveButtons).toEqual(autoscan.$scope.adjacentRooms.east.buttons);

  });

  it('should send the direction the second time a direction is pressed if it has buttons', function(){

    spyOn(telnet,'send');
    scope.directionClick('east');
    scope.directionClick('east');
    expect(telnet.send).toHaveBeenCalled();

  });

  it('should never send a direction for here', function(){
    spyOn(telnet,'send');
    scope.directionClick('here');
    scope.directionClick('here');
    expect(telnet.send).not.toHaveBeenCalled();

  });

  it('should not send a direction unless it\'s been pressed two times in a row', function(){

    spyOn(telnet,'send');
    scope.directionClick('east');
    scope.directionClick('here');
    scope.directionClick('east');
    expect(telnet.send).not.toHaveBeenCalled();

  });

});
