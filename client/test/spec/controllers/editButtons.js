'use strict';

describe('Controller: EditButtonsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditButtonsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditButtonsCtrl = $controller('EditButtonsCtrl', {
      $scope: scope
    });
  }));

  it('should attach an array of buttons to the scope', function () {
    expect($.isArray(scope.activeButtons)).toBe(true);
  });

});
