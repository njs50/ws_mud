'use strict';

describe('Directive: autoscroll', function () {
  beforeEach(module('clientApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<div style="height:200px; overflow-y: scroll;" autoscroll></div>');
    element = $compile(element)($rootScope);

    element.append('<div style="height:6000px">hello</div>');

    $rootScope.$digest();

  }));
});
