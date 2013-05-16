'use strict';

describe('Directive: commandBar', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, scope;

  beforeEach(inject(function ($rootScope, $compile){
    element = angular.element('<command-bar></command-bar>');
    element = $compile(element)($rootScope);
    scope = element.scope();
  }));

  it('should pass keypress events to the controller', function() {
    spyOn(scope,'keyDown');
    element.trigger(createKeyEvent(13));
    expect(scope.keyDown).toHaveBeenCalled();
  });

  it('should pass keypress events to the controller', function() {
    spyOn(scope,'keyDown');
    element.trigger(createKeyEvent(40, false, false, true));
    expect(scope.keyDown).toHaveBeenCalled();
  });



  it('should have bound the input to the controller', function() {
    scope.command = 'I like pie';
    scope.$digest();
    expect(element.val()).toBe('I like pie');
  });

});
