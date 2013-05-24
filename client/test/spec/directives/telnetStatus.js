'use strict';

describe('Directive: telnetStatus', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, scope, telnet;

  beforeEach(inject(function ($rootScope, $compile, _telnet_) {

    telnet = _telnet_;

    element = angular.element('<li><a telnet-status>test</a></li>');
    element = $compile(element)($rootScope);
    scope = element.scope();

    scope.$digest();

  }));


  it('should be offline initally', function(){
    var a = element.find('a');

    expect(a.eq(0)).not.toHaveClass('connected');
    expect(a.eq(0)).toHaveClass('disconnected');
  });


  it('should be online after connecting to telnet', function(){

    var a = element.find('a');

    telnet.connect('example.com',23);
    scope.$digest();

    expect(telnet.$scope.bConnected).toBe(true);

    expect(a.eq(0)).toHaveClass('connected');
    expect(a.eq(0)).not.toHaveClass('disconnected');

  });



  it('should toggle between online and offline by clicking the links', function(){

    var a = element.find('a');

    telnet.connect('example.com',23);
    scope.$digest();

    expect(telnet.$scope.bConnected).toBe(true);

    // click on the disconnect link
    $(a.eq(0)).click();
    scope.$digest();
    expect(telnet.$scope.bConnected).toBe(false);

    // click the connect link
    $(a.eq(0)).click();
    scope.$digest();
    expect(telnet.$scope.bConnected).toBe(true);

  });


});
