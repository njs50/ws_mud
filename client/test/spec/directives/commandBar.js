'use strict';

describe('Directive: commandBar', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, scope;

  var createKeyEvent = function (mainKey, alt, ctrl, shif) {
    var keyEvent = jQuery.Event("keydown");

    keyEvent.keyCode = mainKey;
    keyEvent.which = mainKey;
    keyEvent.altKey = alt || false;
    keyEvent.ctrlKey = ctrl || false;
    keyEvent.shiftKey = shif || false;

    return keyEvent;
  };


  beforeEach(inject(function ($rootScope, $compile){
    element = angular.element('<command-bar></command-bar>');
    element = $compile(element)($rootScope);
    scope = element.scope();
  }));


  it('should trigger the controllers enterCommand function when enter is pressed', function() {
    spyOn(scope,'enterCommand');
    element.trigger(createKeyEvent(13));
    expect(scope.enterCommand).toHaveBeenCalled();
  });

  it('should trigger the controllers historyCommand function when up is pressed', function() {
    spyOn(scope,'historyCommand');
    element.trigger(createKeyEvent(38));
    expect(scope.historyCommand).toHaveBeenCalled();

  });

  it('should trigger the controllers historyCommand function when down is pressed', function() {
    spyOn(scope,'historyCommand');
    element.trigger(createKeyEvent(40));
    expect(scope.historyCommand).toHaveBeenCalled();
  });

  it('should have bound the input to the controller', function() {
    scope.command = 'I like pie';
    scope.$digest();
    expect(element.val()).toBe('I like pie');
  });

});
