'use strict';

describe('Directive: mapView', function () {
  beforeEach(module('clientApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<map-view></map-view>');
    element = $compile(element)($rootScope);
    // expect(element.text()).toBe('this is the mapView directive');
  }));
});
