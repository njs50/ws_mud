'use strict';

describe('Directive: autoscroll', function () {

  beforeEach(module('clientApp'));
  beforeEach(module('mockTelnetServiceApp'));

  var element, host, telnet;

  beforeEach(inject(function($rootScope, $compile, _telnet_) {

    telnet = _telnet_;
    $rootScope.telnet = telnet;

    // create a host div in the actual dom
    host = $('<div id="host"></div>');
    $('body').append(host);

    // create element and append to host
    element = angular.element('<div style="height:200px; overflow-y: scroll;" ng-bind-html-unsafe="telnet.$scope.outputBuffer" autoscroll></div>');
    host.append(element);

    // compile element in context now it's in the dom...
    element = $compile(element)($rootScope);

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


  it('should stop auto scrolling if manually scrolled up', inject(function ($rootScope) {

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


});
