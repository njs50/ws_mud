'use strict';

describe('Controller: MainCtrl tests', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MainCtrl, scope, win;

  // Initialize the controller and a mock scope

  beforeEach(inject(function ($controller, $rootScope, $window) {

    scope = $rootScope;
    MainCtrl = $controller('MainCtrl', {$scope: scope});
    win = angular.element($window);

  }));

  describe('tests for windowHeight', function(){

    it('should have windowHeight defined and update it when a window resize occurs', function () {

      expect(scope.windowHeight).not.toBeUndefined();
      expect(scope.windowHeight).not.toBeNull();
      expect(scope.windowHeight).toBeGreaterThan(0);

      // can't actually resize the test window, so fake it
      var oldHeight = scope.windowHeight;
      scope.windowHeight = 0;
      win.triggerHandler('resize');

      // should have the original size again
      expect(scope.windowHeight).toBe(oldHeight);

      // make sure it doesn't change if nothing has changed
      win.triggerHandler('resize');
      expect(scope.windowHeight).toBe(oldHeight);

    });



  });




});