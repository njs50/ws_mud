'use strict';

angular.module('mockTelnetServiceApp')
  .factory('telnet', ['$rootScope', function($rootScope) {

  var scope = $rootScope.$new();
  scope.outputBuffer = '';
  scope.bConnected = false;
  scope.maxScrollback = 20000;
  scope.server = '';
  scope.port = '';

  scope.telnetEvents = {
    parsePrompt: 'TELNET_PARSE_PROMPT',
    parseBlock: 'TELNET_PARSE_BLOCK',
    parseLine: 'TELNET_PARSE_LINE',
    connect: 'TELNET_CONNECT',
    disconnect: 'TELNET_DISCONNECT',
  };

  // Private functions


  // Public API here
  return {

    getScope: function() {
      return scope;
    },

    send: function() {
      //console.log('telnet: ' + cmd);
    },

    connect: function(server, port) {
      //console.log('telnet: connect to ' + server + ':' + port);
      scope.server = server;
      scope.port = port;
      scope.bConnected = true;
    },

    disconnect: function() {
     // console.log('telnet: disconnect');
      scope.bConnected = false;
    },

    relayPrompt: function(txt) {
      scope.$broadcast(scope.telnetEvents.parsePrompt,txt);
    },

    relayLines: function(txt) {
      $(txt.split('\n')).each(function(idx,item){
        scope.$broadcast(scope.telnetEvents.parseLine,item);
      });
    },

    relayBlock: function(txt) {
      scope.$broadcast(scope.telnetEvents.parseBlock,txt);
    }


  };


}]);