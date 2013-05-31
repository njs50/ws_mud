'use strict';

describe('Directive: commandBar', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, scope, host, $window;

  var keypress = function(target, mainKey, alt, ctrl, shif) {

    mainKey = mainKey.charCodeAt(0);

    var keyDownEvent = jQuery.Event('keydown');
    keyDownEvent.keyCode = mainKey;
    keyDownEvent.which = mainKey;
    keyDownEvent.altKey = alt || false;
    keyDownEvent.ctrlKey = ctrl || false;
    keyDownEvent.shiftKey = shif || false;


    var keyUpEvent = jQuery.Event('keydown');
    keyUpEvent.keyCode = mainKey;
    keyUpEvent.which = mainKey;
    keyUpEvent.altKey = alt || false;
    keyUpEvent.ctrlKey = ctrl || false;
    keyUpEvent.shiftKey = shif || false;

    $(target)
      .focus()
      .trigger(keyDownEvent)
      .trigger(keyUpEvent)
    ;

  };


  beforeEach(inject(function ($rootScope, $compile, _$window_){

    $window = _$window_;

    // create a host div in the actual dom
    host = $('<div id="host"></div>');
    $('body').append(host);

    // create element and append to host

    element = angular.element('<command-bar></command-bar>');
    host.append(element);
    host.append('<input type="text" id="inputTest" />');

    element = $compile(element)($rootScope);

    scope = element.scope();

  }));

  afterEach(function() {
    // remove host div
    host.remove();
  });

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


  it('should acquire focus if key is pressed in a non input field', function() {

    var oInput = $('#inputTest');

    keypress('#inputTest','x');

    expect(document.activeElement).toBe(oInput);

    // send focus back to body
    oInput.blur();
    keypress('body','x');

    expect(document.activeElement).toBe(element);

   // dump($(':focus'));

  //  dump(document.activeElement);

    scope.$digest();



    //dump(host);

  });







});
