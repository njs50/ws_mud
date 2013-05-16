'use strict';

describe('Controller: ScanCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var ScanCtrl,
    telnet,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _telnet_) {
    scope = $rootScope.$new();
    telnet = _telnet_;
    ScanCtrl = $controller('ScanCtrl', {
      $scope: scope
    });
  }));









});
