'use strict';

describe('Directive: autoscroll', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, host, telnet, win, scope;

  beforeEach(inject(function($rootScope, $compile, _telnet_, $window) {

    telnet = _telnet_;
    $rootScope.telnet = telnet;
    win = $window;
    scope = $rootScope.$new();

    // create a host div in the actual dom
    host = $('<div id="host"></div>');
    $('body').append(host);

    // create element and append to host
    element = angular.element('<div style="height:200px; overflow-y: scroll;"><autoscroll content="telnet.$scope.outputBuffer" enabled="true"></autoscroll></div>');
    host.append(element);

    // compile element in context now it's in the dom...
    element = $compile(element)(scope);

    scope.$digest();

  }));

  afterEach(function() {
    // remove host div
    host.remove();
  });


  it('should scroll down when content is added that exceeds the height of the container', function () {

    // before added
    expect(element.eq(0).scrollTop()).toBe(0);

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // after added
    expect(element.eq(0).scrollTop()).toBe(400);

  });


  xit('should stop auto scrolling if manually scrolled up', inject(function ($rootScope) {

    // before added

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // scroll back up 200
    element.eq(0).scrollTop(200);
    element.triggerHandler('scroll');

    $rootScope.$digest();

    telnet.$scope.outputBuffer += '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // after added
    expect(element.eq(0).scrollTop()).toBe(200);

  }));

  it('should resume auto scrolling when scrolled to bottom of container', inject(function ($rootScope) {

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // scroll back up 200
    element.eq(0).scrollTop(200);
    element.triggerHandler('scroll');
    $rootScope.$digest();

    element.triggerHandler('pause');

    // scroll back down to the bottom
    element.eq(0).scrollTop(400);
    element.triggerHandler('scroll');
    $rootScope.$digest();

    telnet.$scope.outputBuffer += '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // scolling should have resumed, so we should be at the bottom again
    expect(element.eq(0).scrollTop()).toBe(1000);

  }));

  it('should resume scrolling if window is resized', inject(function ($rootScope) {

    // before added

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // scroll back up 200
    element.eq(0).scrollTop(200);
    element.triggerHandler('scroll');

    element.triggerHandler('pause');
    $rootScope.$digest();

    telnet.$scope.outputBuffer += '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // after added
    expect(element.eq(0).scrollTop()).toBe(200);

    angular.element(win).triggerHandler('resize');
    $rootScope.$digest();

    expect(element.eq(0).scrollTop()).toBe(1000);

  }));


  it('should resume scrolling if enter is pressed', inject(function ($rootScope) {

    // before added

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // scroll back up 200
    element.eq(0).scrollTop(200);
    element.triggerHandler('scroll');
    element.triggerHandler('pause');
    $rootScope.$digest();

    telnet.$scope.outputBuffer += '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // after added, expect us to be scrolled up
    expect(element.eq(0).scrollTop()).toBe(200);

    $(window).trigger(testHelpers.createKeyEvent(13));

    expect(element.eq(0).scrollTop()).toBe(1000);

  }));

  it('should resume scrolling if space is pressed', inject(function ($rootScope) {

    // before added

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // scroll back up 200
    element.eq(0).scrollTop(200);
    element.triggerHandler('scroll');
    element.triggerHandler('pause');
    $rootScope.$digest();

    telnet.$scope.outputBuffer += '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // after added, expect us to be scrolled up
    expect(element.eq(0).scrollTop()).toBe(200);

    $(window).trigger(testHelpers.createKeyEvent(32));

    expect(element.eq(0).scrollTop()).toBe(1000);

  }));

  it('shouldnt resume scrolling if any other key is pressed', inject(function ($rootScope) {

    // before added

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // scroll back up 200
    element.eq(0).scrollTop(200);
    element.triggerHandler('scroll');

    element.triggerHandler('pause');
    $rootScope.$digest();

    telnet.$scope.outputBuffer += '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // after added, expect us to be scrolled up
    expect(element.eq(0).scrollTop()).toBe(200);

    $(window).trigger(testHelpers.createKeyEvent(17));

    expect(element.eq(0).scrollTop()).toBe(200);

  }));


  it('should unbind events when scope destroyed', function () {

    // once unbound no changes should move the scrollback
    scope.$destroy();

    telnet.$scope.outputBuffer = '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');
    telnet.$scope.$broadcast(telnet.$scope.telnetEvents.bufferUpdated);

    // after added
    expect(element.eq(0).scrollTop()).toBe(0);

    telnet.$scope.outputBuffer += '<div style="height:600px">hello</div>';
    telnet.$scope.$apply('outputBuffer');

    angular.element(win).triggerHandler('resize');

    expect(element.eq(0).scrollTop()).toBe(0);

  });


});
