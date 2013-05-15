'use strict';

describe('Directive: scanDirection', function () {

  beforeEach(module('clientApp'));

  var btnEast, btnWest, btnUp, scope;

  // load the templates

  beforeEach(module('clientApp'));

  beforeEach(inject(function($rootScope, $compile) {
    // we might move this tpl into an html file as well...

    scope = $rootScope;

    scope.adjacentRooms = {
      'north': ['fragile ancient sage'],
      'east': ['medienne guard member', 'gnomish youth', 'old wise elf'],
      'south': ['moorhound', 'forest ranger'],
      'west': []
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
