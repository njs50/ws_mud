'use strict';

angular.module('mockTelnetServiceApp')
  .factory('telnet', ['$rootScope', function($rootScope) {

  var scope = $rootScope.$new();
  scope.outputBuffer = '';
  scope.bConnected = false;
  scope.maxScrollback = 20000;
  scope.server = '';
  scope.port = '';

  // Private functions


  // Public API here
  return {

    getScope: function() {
      return scope;
    },

    send: function(cmd) {
      //console.log('telnet: ' + cmd);
    },

    connect: function(server, port) {
      //console.log('telnet: connect to ' + server + ':' + port);
      scope.server = server;
      scope.port = port;
      scope.bConnected = true;
    },

    disconnect: function(server, port) {
     // console.log('telnet: disconnect');
      scope.bConnected = false;
    }

  };


}]);