'use strict';

describe('Directive: telnetStatus', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  beforeEach(module('templates/telnetStatus.tpl.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope, $compile, _telnet_) {

    scope = $rootScope;
    scope.telnet = _telnet_;
    scope.telnetScope = scope.telnet.getScope();

    element = angular.element('<ul><telnet-status></telnet-status></ul>');

    $compile(element)($rootScope);

    $rootScope.$digest();

  }));


  it('should be offline initally', function(){
    var a = element.find('a');
    expect(a.eq(0)).not.toHaveCss({display: 'none'});
    expect(a.eq(1)).toHaveCss({display: 'none'});

  });


  it('should be online after connecting to telnet', function(){

    var a = element.find('a');

    scope.telnet.connect('example.com',23);
    scope.$digest();

    expect(scope.telnetScope.bConnected).toBe(true);

    expect(a.eq(0)).toHaveCss({display: 'none'});
    expect(a.eq(1)).not.toHaveCss({display: 'none'});

  });



  it('should toggle between online and offline by clicking the links', function(){

    var a = element.find('a');

    scope.telnet.connect('example.com',23);
    scope.$digest();

    expect(scope.telnetScope.bConnected).toBe(true);

    // click on the disconnect link
    $(a.eq(1)).click();
    expect(scope.telnetScope.bConnected).toBe(false);

    // click the connect link
    $(a.eq(0)).click();
    expect(scope.telnetScope.bConnected).toBe(true);

  });


});
