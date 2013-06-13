'use strict';

angular.module('mockTelnetServiceApp')
  .factory('telnet', ['$rootScope', 'promptParser', function($rootScope, _promptParser_) {

  var promptParser = _promptParser_;
  var scope = $rootScope.$new();
  scope.outputBuffer = '';
  scope.bConnected = false;
  scope.maxScrollback = 20000;
  scope.server = '';
  scope.port = '';

  scope.bConsoleOutput = false;

  scope.telnetEvents = {
    parsePrompt: 'TELNET_PARSE_PROMPT',
    parseTextPrompt: 'TELNET_PARSE_INVALID_PROMPT',
    parseBlock: 'TELNET_PARSE_BLOCK',
    parseLine: 'TELNET_PARSE_LINE',
    connect: 'TELNET_CONNECT',
    disconnect: 'TELNET_DISCONNECT',
    bufferUpdated: 'TELNET_OUTPUT_BUFFER_UPDATE'
  };

  // Private functions


  // Public API here
  return {

    send: function(cmd) {
      if (scope.bConsoleOutput) {
        console.log('telnet send: ' + cmd);
      }
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

      var oPrompt = promptParser.parse(txt);
      if (oPrompt !== null) {
        scope.$broadcast(scope.telnetEvents.parsePrompt,oPrompt);
        if (scope.bConsoleOutput) {
          console.log('telnet prompt: ' + txt);
          console.log(oPrompt);
        }
      } else {
        scope.$broadcast(scope.telnetEvents.parseTextPrompt,txt);
        if (scope.bConsoleOutput) {
          console.log('text prompt: ' + txt);
        }
      }
    },

    relayLines: function(txt) {
      $(txt.split('\n')).each(function(idx,item){
        scope.$broadcast(scope.telnetEvents.parseLine,item);
        if (scope.bConsoleOutput) {
          console.log('telnet output: ' + item);
        }
      });
    },

    setConsoleOutput: function(bStatus) {
      scope.bConsoleOutput = bStatus;
    },

    '$scope': scope

/*
    relayBlock: function(txt) {
      scope.$broadcast(scope.telnetEvents.parseBlock,txt);
    }
*/

  };


}]);