'use strict';

describe('Service: buttons', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  var buttons, autoscan, aPrevious;

  // instantiate service
  beforeEach(inject(function (_buttons_, _autoscan_) {
    buttons = _buttons_;
    autoscan = _autoscan_;
    aPrevious = buttons.$scope.aActiveButtons;
    autoscan.$scope.adjacentRooms = {
      'north': {
        type: 'mobs',
        buttons: [
          {label:'a fragile ancient sage', command: 'north & kill fragile.sage'}
        ]
      }
    };

  }));


  it('should do something', function () {
    expect(!!buttons).toBe(true);
  });

  it('should be able to change the buttons', function () {

    buttons.setDirectionButtons('north');
    expect(buttons.$scope.aActiveButtons).toBe(autoscan.$scope.adjacentRooms.north.buttons);

  });

  it('should not change the buttons if an invalid direction is chosen', function () {

    buttons.setDirectionButtons('east');
    expect(buttons.$scope.aActiveButtons).toBe(aPrevious);

  });


  it('should be able to reset the buttons', function () {

    buttons.setDirectionButtons('north');
    expect(buttons.$scope.aActiveButtons).toBe(autoscan.$scope.adjacentRooms.north.buttons);

    buttons.resetButtons();
    expect(testHelpers.flush()).toBe(true);

    expect(buttons.$scope.aActiveButtons).toBe(aPrevious);

  });


  it('should not reset buttons if they are already the default buttons', function () {

    expect(buttons.$scope.aActiveButtons).toBe(aPrevious);

    buttons.resetButtons();
    expect(testHelpers.flush()).toBe(false);

    expect(buttons.$scope.aActiveButtons).toBe(aPrevious);

  });


});
