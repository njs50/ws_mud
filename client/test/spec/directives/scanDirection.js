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

    scope.mobs = ['one', 'two'];
    scope.direction = 'north';

    elm = angular.element('<scan-direction direction="{{direction}}" mobs="mobs" />');

    $compile(elm)(scope);
    scope.$digest();

  }));

  it('should make some list items', inject(function () {

    var li = elm.find('li');

    expect(li.length).toBe(3);

    // first direction
    expect(li.eq(0).text()).toBe('north');

    // then one for each mob
    expect(li.eq(1).text()).toBe('one');
    expect(li.eq(2).text()).toBe('two');

  }));



  it('should set the correct classes for display', inject(function () {

    var li = elm.find('li');

    expect(li.length).toBe(3);

    expect(li.eq(0)).toHaveClass('nav-header');
    expect(li.eq(1)).not.toHaveClass('nav-header');
    expect(li.eq(2)).not.toHaveClass('nav-header');


  }));



});
