'use strict';

angular.module('clientApp')
  .factory('telnet', ['$rootScope', function ($rootScope) {
    // Service logic
    // ...

    var scope = $rootScope.$new();
    scope.outputBuffer = 'Hello, this is your <b>telnet</b> speaking...<br />';
    scope.bConnected = false;




    var addMessage = function(msg) {
      scope.outputBuffer += msg;
      scope.$apply('outputBuffer');
    };


    // Public API here
    return {

      getScope: function () {
        return scope;
      },

      send: function(cmd) {
        addMessage( '<span class="cmd">' + cmd + '</span><br />' );
        console.log('telnet: ' + cmd);
      },

      connect: function(server,port) {
        console.log('telnet: connect to ' + server + ':' + port);
      }

    };



  }]);
