'use strict';

describe('Controller: EditButtonsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditButtonsCtrl,
    location,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    location = $location;
    EditButtonsCtrl = $controller('EditButtonsCtrl', {
      $scope: scope
    });
  }));

  it('should attach an array of buttons to the scope', function () {
    expect($.isArray(scope.activeButtons)).toBe(true);
  });

  it('should undo button changes if requested', function () {
    var originalButtons = angular.copy(scope.activeButtons);
    scope.activeButtons = [];
    scope.undo();
    expect(scope.activeButtons).toEqual(originalButtons);
  });

  it('clicking done should take you back to the main view', function () {
    spyOn(location,'path');
    scope.done();
    expect(location.path).toHaveBeenCalledWith('/');
  });

});
