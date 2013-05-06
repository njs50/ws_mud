'use strict';

angular.module('clientApp')

  .directive('telnetSend', ['telnet',function (telnet) {
    return function(scope,element, attrs) {
      element.bind('click',function(){
        telnet.send(attrs.telnetSend);
      });
    };

  }]);
