'use strict';


describe('directive: telnetSend', function () {

  beforeEach(module('clientApp'));

  var element, scope;


  beforeEach(inject(function($rootScope, $compile) {

    element = angular.element('<a telnet-send="testing 1 2 3">test</a>');
    scope = $rootScope;
    $compile(element)(scope);
    scope.$digest();

  }));


  //until telnet is actually hooked up...
  it('should write to the console on click', inject(function () {

    spyOn(console,'log');
    element.triggerHandler('click');
    expect(console.log).toHaveBeenCalledWith('telnet: testing 1 2 3');

  }));



});
