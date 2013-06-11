'use strict';


// main controller for the app...
angular.module('clientApp')
  .controller('MainCtrl', ['$scope', '$rootScope','$window', 'telnet', '$timeout', 'profile',
    function ($scope,$rootScope,$window, telnet, $timeout, profile) {

    var bIsDev = $(location).attr('hostname') === 'localhost';

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

      if ($rootScope.windowHeight > $rootScope.windowWidth || $rootScope.windowWidth < 940 ) {
        $rootScope.windowOrientation = 'portrait';
      } else {
        $rootScope.windowOrientation = 'landscape';
      }

      if (oldOrientation !== $rootScope.windowOrientation) {
        bApplyUpdate = true;
      }

      if(bApplyUpdate){
        $timeout(function(){
          $rootScope.$digest();
        }, 0, false);
      }

    };


    // update whenever the window triggers the resize event
    angular.element($window).bind('resize',function(){
      setupWindow();
    });


    setupWindow();


    // bind to the window onbeforeunload so we can warn if closing an active session
    $window.onbeforeunload = function(){
      // save users profile
      profile.save();
      // if this isn't dev we should warn them if they have an active connection
      if (!bIsDev && telnet.$scope.bConnected) {
        return('You are currently connected to ' + telnet.$scope.server);
      }
      return;
    };

    var port = 8000;
    var server = 'theforestsedge.com';

    // some junk to auto login to dev server
    if (bIsDev) {
      port = 7000;
      server = 'vault-thirteen.net';
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
