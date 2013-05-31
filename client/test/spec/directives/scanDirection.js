'use strict';

describe('Directive: scanDirection', function () {

  beforeEach(module('clientApp'));

  var btnEast, btnWest, btnUp, btnDown, btnNorth, btnSouth, bthRefresh, btnHere,
    scope, buttons;

  // load the templates

  beforeEach(module('clientApp'));

  beforeEach(inject(function($rootScope, $compile, $controller, autoscan, _buttons_) {
    // we might move this tpl into an html file as well...

    scope = $rootScope.$new();
    buttons = _buttons_;

    scope.directionClick = function() {};



    btnUp = angular.element('<button scan-direction="up"></button>');
    $compile(btnUp)(scope);
    btnEast = angular.element('<button scan-direction="east"></button>');
    $compile(btnEast)(scope);
    btnWest = angular.element('<button scan-direction="west"></button>');
    $compile(btnWest)(scope);
    btnDown = angular.element('<button scan-direction="down"></button>');
    $compile(btnDown)(scope);
    btnNorth = angular.element('<button scan-direction="north"></button>');
    $compile(btnNorth)(scope);
    btnSouth = angular.element('<button scan-direction="south"></button>');
    $compile(btnSouth)(scope);
    bthRefresh = angular.element('<button scan-direction="refresh"></button>');
    $compile(bthRefresh)(scope);
    btnHere = angular.element('<button scan-direction="here"></button>');
    $compile(btnHere)(scope);

    autoscan.$scope.adjacentRooms = {
      'north': {
        type: 'mobs',
        buttons: [
          {label:'a fragile ancient sage', command: 'north & kill fragile.sage'}
        ]
      },
      'east': {
        type: 'mobs',
        buttons: [
          {label:'a medienne guard member', command: 'east & kill medienne.guard.member'},
          {label:'a gnomish youth', command: 'east & kill gnomish.youth'},
          {label:'an old wise elf', command: 'east & kill old.wise.elf'}
        ]
      },
      'south': {
        type: 'locked',
        buttons: [
          {label:'open', command: 'open south'}
        ]
      },
      'west': {
        type: 'empty',
        buttons: []
      }
    };

    autoscan.$scope.$apply('adjacentRooms');

  }));



  it('should set the correct classes for display on each button', inject(function () {

    // disabled class for anything with no exit
    expect(btnUp).toHaveClass('disabled muted');
    expect(btnEast).not.toHaveClass('disabled muted');
    expect(btnWest).not.toHaveClass('disabled muted');

    // danger class for anything with adjacent mobs
    expect(btnEast).toHaveClass('btn-danger');
    expect(btnWest).not.toHaveClass('btn-danger');
    expect(btnUp).not.toHaveClass('btn-danger');

  }));

  it('should call directionClick when clicked', inject(function () {

    spyOn(scope,'directionClick');
    btnEast.triggerHandler('click');
    expect(scope.directionClick).toHaveBeenCalledWith('east');

  }));


  it('should gain the selected class if the direction attribute matches the active button set', inject(function () {

    buttons.$scope.buttonSet = '';
    buttons.$scope.$apply('buttonSet');
    expect(btnEast).not.toHaveClass('selected');

    buttons.$scope.buttonSet = 'east';
    buttons.$scope.$apply('buttonSet');
    expect(btnEast).toHaveClass('selected');

  }));



});
