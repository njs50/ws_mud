'use strict';


describe('directive: telnetSend', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, scope, telnet;


  beforeEach(inject(function($rootScope, $compile, _telnet_) {

    scope = $rootScope;
    telnet = _telnet_;

    element = angular.element('<a telnet-send="testing 1 2 3">test</a>');
    $compile(element)(scope);
    scope.$digest();

  }));


  //until telnet is actually hooked up...
  it('should send the command to telnet on click', inject(function () {
    spyOn(telnet,'send');
    element.triggerHandler('click');
    expect(telnet.send).toHaveBeenCalledWith('testing 1 2 3');

  }));



});
