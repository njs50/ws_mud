'use strict';


// main controller for the app...
angular.module('clientApp')
  .controller('MainCtrl', ['$scope', '$rootScope','$window', 'telnet', '$timeout', function ($scope,$rootScope,$window,telnet, $timeout) {

    // set the initial windowheight
    $rootScope.telnet = telnet;

    var setupWindow = function() {

      var bApplyUpdate = false;
      var oldOrientation = $rootScope.windowOrientation;

      if ($rootScope.windowHeight !== $window.innerHeight) {
        $rootScope.windowHeight = $window.innerHeight;
        bApplyUpdate = true;
      }

      if ($rootScope.windowWidth !== $window.innerWidth) {
        $rootScope.windowWidth = $window.innerWidth;
        bApplyUpdate = true;
      }

      if ($rootScope.windowHeight <= $rootScope.windowWidth) {
        $rootScope.windowOrientation = 'landscape';
      } else {
        $rootScope.windowOrientation = 'portrait';
      }

      if (oldOrientation !== $rootScope.windowOrientation) {
        bApplyUpdate = true;
      }

      if(bApplyUpdate){
        $timeout(function(){
          $rootScope.$apply('windowWidth');
          console.log('applied resize');
        }, 0);
      }

    };


    // update whenever the window triggers the resize event
    angular.element($window).bind('resize',function(){
      setupWindow();
    });


    setupWindow();


    var port = 8000;
    var server = 'vault-thirteen.net';

    // some junk to auto login to dev server
    if ($(location).attr('hostname') === 'localhost') {
      port = 7000;
      telnet.$scope.$on(telnet.$scope.telnetEvents.parsePrompt, function(e, prompt) {
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

    }

    telnet.connect(server, port);

  }])
;
