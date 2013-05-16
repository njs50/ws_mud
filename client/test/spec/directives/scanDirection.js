'use strict';

describe('Directive: scanDirection', function () {

  beforeEach(module('clientApp'));

  var btnEast, btnWest, btnUp, scope;

  // load the templates

  beforeEach(module('clientApp'));

  beforeEach(inject(function($rootScope, $compile, _autoscan_) {
    // we might move this tpl into an html file as well...

    scope = $rootScope;
    scope.autoscan = _autoscan_;

    scope.autoscan.$scope.adjacentRooms = {
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
        type: 'mobs',
        buttons: [
          {label:'a moorhound', command: 'south & kill moorhound'},
          {label:'a forest ranger', command: 'south & kill forest.ranger'}
        ]
      },
      'west': {
        type: 'empty',
        buttons: []
      }

    };


    btnEast = angular.element('<button scan-direction="east"></button>');
    $compile(btnEast)(scope);
    btnWest = angular.element('<button scan-direction="west"></button>');
    $compile(btnWest)(scope);
    btnUp = angular.element('<button scan-direction="up"></button>');
    $compile(btnUp)(scope);

    scope.$digest();



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


});
