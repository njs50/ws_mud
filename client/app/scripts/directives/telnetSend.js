'use strict';

angular.module('clientApp')

  .directive('telnetSend', function () {
    return function(scope,element, attrs) {
      element.bind('click',function(){
        console.log('telnet: ' + attrs.telnetSend);
      });
    };

  });
