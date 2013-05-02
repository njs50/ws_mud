'use strict';

describe('Controller: ScanCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ScanCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScanCtrl = $controller('ScanCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of adjacent mobs to the scope', function () {
    expect(scope.adjacentMobs.east.length).toBe(3);
  });

});
