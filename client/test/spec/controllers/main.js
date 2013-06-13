'use strict';

describe('Controller: MainCtrl tests', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var MainCtrl, scope, win, mock, telnet, $httpBackend;

  // Initialize the controller and a mock scope




  beforeEach(function() {

    mock = {innerHeight: 300, innerWidth: 1000, onbeforeunload: function(){}};

    module(function($provide) {
      $provide.value('$window', mock);
    });

    inject(function ($controller, $rootScope, $window, _telnet_, _$httpBackend_) {

      $httpBackend = _$httpBackend_;
      telnet = _telnet_;
      scope = $rootScope;
      MainCtrl = $controller('MainCtrl', {$scope: scope});
      win = angular.element($window);

      $httpBackend.when('GET', 'version.json').respond({version: '0.10.abcdef'}, {'A-Token': 'xxx'});

    });

  });




  it('should have windowHeight defined and update it when a window resize occurs', function () {

    expect(scope.windowHeight).not.toBeUndefined();
    expect(scope.windowHeight).not.toBeNull();
    expect(scope.windowHeight).toBeGreaterThan(0);

    mock.innerHeight = 2000;
    win.triggerHandler('resize');

    // should have the original size again
    expect(scope.windowHeight).toBe(2000);

  });


  it('should confirm the user wants to close the window if connected (and not in dev)', function () {

    telnet.connect('vault-thirteen.net',8000);
    scope.bIsDev = true;

    var unload = mock.onbeforeunload();
    expect(unload).toBe(undefined);


    scope.bIsDev = false;

    unload = mock.onbeforeunload();
    expect(unload).toBe('You are currently connected to vault-thirteen.net');

    telnet.disconnect();

    unload = mock.onbeforeunload();
    expect(unload).toBe(undefined);

  });



});