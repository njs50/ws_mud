'use strict';

describe('Directive: commandBar', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));
  beforeEach(module('templates/commandBar.tpl.html'));

  var element, scope, host, $window, inputField;



  beforeEach(inject(function ($rootScope, $compile, _$window_){

    $window = _$window_;

    // create a host div in the actual dom
    host = $('<div id="host"></div>');
    $('body').append(host);

    // create element and append to host

    element = angular.element('<command-bar></command-bar>');
    element = $compile(element)($rootScope.$new());
    scope = element.scope();

    host.append(element);
    host.append('<input type="text" id="inputTest" />');

    scope.$digest();
    inputField = element.find('input').eq(0);


  }));

  afterEach(function() {
    // remove host div
    host.remove();
  });

  it('should pass keypress events to the controller', function() {
    spyOn(scope,'keyDown');
    element.trigger(testHelpers.createKeyEvent(13));
    expect(scope.keyDown).toHaveBeenCalled();
  });

  it('should pass keypress events to the controller', function() {
    spyOn(scope,'keyDown');
    element.trigger(testHelpers.createKeyEvent(40, false, false, true));
    expect(scope.keyDown).toHaveBeenCalled();
  });

  it('should have bound the input to the controller', function() {
    scope.command = 'I like pie';
    scope.$digest();
    expect(inputField.val()).toBe('I like pie');
  });



  it('should acquire focus if key is pressed in a non input field', function() {

    var oInput = $('#inputTest');
    testHelpers.createKeyPress('#inputTest','x');
    expect(document.activeElement).toBe(oInput);

    // send focus back to body
    oInput.blur();
    testHelpers.createKeyPress('#host','x');
    scope.$digest();
    expect(document.activeElement).toBe(inputField);

  });


  it('should unbind keypress events when scope destroyed', function() {

    // send focus back to body
    inputField.focus().blur();
    testHelpers.createKeyPress('#host','x');
    scope.$digest();
    expect(document.activeElement).toBe(inputField);

    scope.$destroy();

    inputField.focus().blur();
    testHelpers.createKeyPress('#host','x');

    expect($('input:focus').length).toBe(0);

  });




});
