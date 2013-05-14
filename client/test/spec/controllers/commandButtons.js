'use strict';

describe('Controller: CommandButtonsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CommandButtonsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommandButtonsCtrl = $controller('CommandButtonsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of userCommands to the scope', function () {
    expect(scope.aUserCommands.length).toBe(13);
  });

});
