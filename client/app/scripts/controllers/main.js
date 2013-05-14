'use strict';


// main controller for the app...
angular.module('clientApp')
  .controller('MainCtrl', ['$scope', '$rootScope','$window', 'telnet', '$timeout', function ($scope,$rootScope,$window,telnet, $timeout) {

    // set the initial windowheight
    $rootScope.windowHeight = $window.innerHeight;
    $rootScope.telnetScope = telnet.getScope();
    $rootScope.telnet = telnet;

    // update whenever the window triggers the resize event
    angular.element($window).bind('resize',function(){
      if ($rootScope.windowHeight !== $window.innerHeight) {
        $rootScope.windowHeight = $window.innerHeight;
        $timeout(function(){
          $rootScope.$apply('windowHeight');
        }, 0);
      }
    });


    telnet.connect('vault-thirteen.net', 8000);

    //auto login trigger for now

    $rootScope.telnetScope.$on($rootScope.telnetScope.telnetEvents.parsePrompt, function(e, prompt) {

      // reply to username prompt
      if (prompt.match(/Choice:/)) {
        telnet.send('Tester');
      } else if (prompt.match(/Password:/)) {
        telnet.silentSend('TesterPassword');
      } else if (prompt.match(/Press <return> to continue./)) {
        telnet.send('');
      } else if (prompt.match(/Disconnect previous link?/)) {
        telnet.send('y');
      }

    });


  }])
;
