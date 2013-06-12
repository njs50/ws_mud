'use strict';

describe('Directive: telnetStatus', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, scope, telnet;

  beforeEach(inject(function ($rootScope, $compile, _telnet_) {

    telnet = _telnet_;

    scope = $rootScope.$new();

    element = angular.element('<i telnet-status class="icon-off disconnected"></i>');
    element = $compile(element)(scope);


  }));


  it('should be offline initally', function(){
    expect(element).not.toHaveClass('connected');
    expect(element).toHaveClass('disconnected');
  });


  it('should be online after connecting to telnet', function(){

    telnet.connect('example.com',23);
    telnet.$scope.$digest();

    expect(telnet.$scope.bConnected).toBe(true);

    expect(element).toHaveClass('connected');
    expect(element).not.toHaveClass('disconnected');

  });


  it('should unbind from telnet when scope is destoryed', function(){

    telnet.disconnect();
    telnet.$scope.$digest();
    expect(element).not.toHaveClass('connected');
    expect(element).toHaveClass('disconnected');

    scope.$destroy();

    // classes shouldn't change on status change now since unbound
    telnet.connect('example.com',23);
    telnet.$scope.$digest();

    expect(telnet.$scope.bConnected).toBe(true);

    expect(element).not.toHaveClass('connected');
    expect(element).toHaveClass('disconnected');

  });


  it('should toggle between online and offline by clicking the links', function(){

    telnet.connect('example.com',23);
    telnet.$scope.$digest();

    expect(telnet.$scope.bConnected).toBe(true);

    // click on the disconnect link
    $(element).click();
    telnet.$scope.$digest();
    expect(telnet.$scope.bConnected).toBe(false);

    // click the connect link
    $(element).click();
    telnet.$scope.$digest();
    expect(telnet.$scope.bConnected).toBe(true);

  });


});
