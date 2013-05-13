'use strict';

describe('Directive: scanDirection', function () {

  beforeEach(module('clientApp'));

  var elm, scope;

  // load the templates

  beforeEach(module('clientApp'));

  beforeEach(module('templates/scanDirection.tpl.html'));

  beforeEach(inject(function($rootScope, $compile) {
    // we might move this tpl into an html file as well...

    scope = $rootScope;

    scope.adjacentMobs = {
      'north': ['fragile ancient sage'],
      'east': ['medienne guard member', 'gnomish youth', 'old wise elf'],
      'south': ['moorhound', 'forest ranger'],
      'west': []
    };

    elm = angular.element('<scan-direction></scan-direction>');

    $compile(elm)(scope);
    scope.$digest();

  }));

  it('should a list item for each direction and mob', inject(function () {

    var li = elm.find('li');

    expect(li.length).toBe(10);

    // first direction
    expect(li.eq(0).text()).toBe('east');

    // then one for each mob
    expect(li.eq(1).text()).toBe('medienne guard member');
    expect(li.eq(2).text()).toBe('gnomish youth');

  }));



  it('should set the correct classes for display', inject(function () {

    var li = elm.find('li');

    expect(li.length).toBe(10);

    expect(li.eq(0)).toHaveClass('nav-header');
    expect(li.eq(1)).not.toHaveClass('nav-header');
    expect(li.eq(2)).not.toHaveClass('nav-header');


  }));



});
