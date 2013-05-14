'use strict';

angular.module('clientApp')
  .factory('telnet', ['$rootScope', '$timeout', function($rootScope,$timeout) {

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


  // constants

  var Telnet = {};

  Telnet.ECHO = 1; // toggle local echo mode?
  Telnet.LF = 10; // Line Feed (LF)
  Telnet.CR = 13; // Carriage Return (CR)

  Telnet.ESC = 0x1B; //escape character

  Telnet.WILL = 0xFB; // 251 - WILL (option code)
  Telnet.WONT = 0xFC; // 252 - WON'T (option code)
  Telnet.DO = 0xFD; // 253 - DO (option code)
  Telnet.DONT = 0xFE; // 254 - DON'T (option code)
  Telnet.IAC = 0xFF; // 255 - Interpret as Command (IAC)


  /* Initialize Websock object */
  var ws = new Websock();

  // private
  var state = 0;
  var block_buffer = '';
  var echoMode = 1;
  var openSpans = 0;
  var bPromptAppend = false;

  var logger = function(msg) {
    if (window.console) {
      console.log(msg);
    }
  };

  var closeSpans = function() {
    var rs = '';

    while (openSpans > 0) {
      rs += '</span>';
      openSpans--;
    }

    return rs;
  };

  var intsort = function(x, y) {
    return parseInt(x, 10) - parseInt(y, 10);
  };


  // add something to the output buffer + manage scrollback

  var msg = function(ansiText) {

    // if the current line is a prompt then append output onto it.
    if (bPromptAppend) {
      scope.outputBuffer += ansiText + closeSpans();
      bPromptAppend = false;
    } else {
      scope.outputBuffer += '<br />' + ansiText + closeSpans();
    }

    // if we've passed the max scroll back remove the overflow + 20%
    if (scope.outputBuffer.length > scope.maxScrollback) {
      var newstart = scope.outputBuffer.indexOf('<br />', scope.outputBuffer.length - scope.maxScrollback + Math.ceil(scope.maxScrollback * 0.2));
      if (newstart > 0) {
        scope.outputBuffer = scope.outputBuffer.substr(newstart + 6);
      }
    }

    $timeout(function(){
      scope.$apply('outputBuffer');
    }, 0);

  };


  var dataHandler = function(aBytes) {

    var buffer = '';
    var line_buffer = '';
    var ansi_line_buffer = '';

    // Loop through each available byte returned from the socket connection.
    for (var pos = 0; pos < aBytes.length; pos++) {

      // Read next available byte.
      var b = aBytes[pos];

      switch (state) {

      case 0:
        // If the current byte is the "Interpret as Command" code, set the state to 1.
        if (b === Telnet.IAC) {
          state = 1;
          // if the current byte is the escape char set the state and process ansi chars etc
        } else if (b === Telnet.ECHO) {
          if (echoMode === 0) {
            echoMode = 1;
          } else {
            echoMode = 0;
          }
        } else if (b === Telnet.ESC) {
          state = 3;
          // Else, if the byte is not a carriage return, display the character using the msg() method.
        } else {

          // if this char is a linefeed then process the line...
          if (b === Telnet.LF) {
            // output the line in the buffer
            msg(ansi_line_buffer);

            // add this line to the block buffer
            if (line_buffer.length > 0) {
              block_buffer += line_buffer + '\n';
            }

            // reset the line buffers
            line_buffer = '';
            ansi_line_buffer = '';

          } else {

            // add this char to the line buffer as long as it aint a newline char
            if (b !== Telnet.CR) {
              line_buffer += String.fromCharCode(b);
              if (b === 60) {
                ansi_line_buffer += '&lt;';
              } else if (b === 62) {
                ansi_line_buffer += '&gt;';
              } else {
                ansi_line_buffer += String.fromCharCode(b);
              }
            }

          }

        }

        break;


      case 1:

        // If the current byte is the "DO" code, set the state to 2.
        if (b === Telnet.DO) {
          state = 2;
        } else {
          state = 0;
        }

        break;

        // Blindly reject the option.

      case 2:
        /*
                  Write the "Interpret as Command" code, "WONT" code,
                  and current byte to the socket and send the contents
                  to the server by calling the flush() method.
              */
        ws.send([Telnet.IAC, Telnet.WONT, b]);
        state = 0;

        break;

      case 3:
        /*  Escape char found...
                      -- Process Ansi codes etc
                  */

        /* Begin processing of extended esc code */
        if (String.fromCharCode(b) === '[') {
          buffer = '';
          state = 4;
          continue;
        }
        /* reset terminal command */
        else if (String.fromCharCode(b) === 'c') {
          closeSpans();
          scope.outputBuffer = '';
        }
        /* assorted other things that arn't implemented... */
        else if (String.fromCharCode(b) === 'M') {
          logger('[Scroll Up]');
        } else if (String.fromCharCode(b) === 'D') {
          logger('[Scroll Down]');
        } else if (String.fromCharCode(b) === 'H') {
          logger('[Set Tab]');
        } else if (String.fromCharCode(b) === '8') {
          logger('[Restore Cursor & Attrs]');
        } else if (String.fromCharCode(b) === '7') {
          logger('[Save Cursor & Attrs]');
        } else if (String.fromCharCode(b) === ')') {
          logger('[Font Set G0]');
        } else if (String.fromCharCode(b) === '(') {
          logger('[Font Set G1]');
        } else {
          logger('[unknown escape code : ' + b + ']');
        }

        state = 0;

        break;

      case 4:

        /* we only like 0-9 and ; to be attached to our commands */
        if ((b >= 48 && b <= 57) || b === 59) {
          buffer += String.fromCharCode(b);
        }
        /* change font color etc */
        else if (String.fromCharCode(b) === 'm') {
          //ansi_line_buffer += String.fromCharCode(ESC) + '[' + buffer + 'm';

          var bold_mod = 0;
          var class_list = '';
          var aBuffer = buffer.split(';');

          // resort buffer so that commands (resets and bolds etc) happen before setting colors
          aBuffer.sort(intsort);

          for (var i = 0; i < aBuffer.length; i++) {

            var ansiCode = parseInt(aBuffer[i], 10);

            // reset?
            if (ansiCode === 0 && openSpans > 0) {
              ansi_line_buffer += closeSpans();
            }

            // bight intensity
            if (ansiCode === 1) {
              bold_mod = 8;
            }

            // normal or feint intensity
            if (ansiCode === 2 || ansiCode === 22) {
              bold_mod = 0;
            }

            // underline
            if (ansiCode === 3) {
              class_list += 'italic ';
            }

            // underline
            if (ansiCode === 4) {
              class_list += 'uline ';
            }

            // underline
            if (ansiCode === 5 || ansiCode === 6) {
              class_list += 'blink ';
            }

            // reverse colours
            if (ansiCode === 7) {
              class_list = 'fg8 bg1';
            }

            // underline
            if (ansiCode === 9) {
              class_list += 'strikethrough ';
            }


            // FG color change
            if (ansiCode <= 37 && ansiCode >= 30) {
              class_list += 'fg' + (ansiCode - 29 + bold_mod);
            }

            // BG color change
            if (ansiCode <= 47 && ansiCode >= 40) {
              class_list += 'bg' + (ansiCode - 39 + bold_mod);
            }

          }

          if (class_list.length > 0) {
            ansi_line_buffer += '<span class="' + class_list + '">';
            openSpans++;
          }

          state = 0;
        } else {
          // ignoring all ansi codes other than color changes!
          logger('[ansi:' + buffer + String.fromCharCode(b) + ']');
          state = 0;
        }

        break;

      } // end of state switch

    }




    // parse the block and each line in it (minus prompt)
    if (block_buffer.length > 0) {
      // parse each line in the block
      var aLines = block_buffer.split('\n');
      for (var l = 0; l < aLines.length; l++) {
        scope.$broadcast(scope.telnetEvents.parseLine,aLines[l]);
      }

      // parse the entire block
      scope.$broadcast(scope.telnetEvents.parseBlock,block_buffer);

      block_buffer = '';
    }


    // output lines here.
    if (ansi_line_buffer !== '') {

      // display whatever is in the buffer
      msg(ansi_line_buffer);


      // do prompt parsing stuff here (leftover stuff in the line buffer = prompt
      // make sure prompt is valid...
      // this prompt detection looks super dodgy...
      if (line_buffer.match(/^(<[^>]*>|\s*Choice:|\s*Password:|\s*Disconnect previous link\?)\s*$/) !== null) {

        // parse the prompt (now we know it's valid)
        scope.$broadcast(scope.telnetEvents.parsePrompt,line_buffer);
        bPromptAppend = false;


      } else {

        // this isn't a valid prompt so append the next line onto it
        bPromptAppend = true;

      }

    }

  };

  // bind websocket.js things
  ws.on('message', function() {
    dataHandler(ws.rQshiftBytes(ws.rQlen()));
  });

  ws.on('open', function() {
    //connect_callback();
    scope.bConnected = true;
    bPromptAppend = false;
    msg('<span class="cmd">Connected to ' + scope.server + ':' + scope.port + '</span>');
    scope.$broadcast(scope.telnetEvents.connect);
  });

  ws.on('close', function() {
    scope.bConnected = false;
    bPromptAppend = false;
    msg('<span class="cmd">Disconnected...</span>');
    scope.$broadcast(scope.telnetEvents.disconnect);
  });

  ws.on('error', function() {
    bPromptAppend = false;
    msg('<span class="cmd">Connection error occured...</span>');
  });




  // Private functions


  // Public API here
  return {

    getScope: function() {
      return scope;
    },

    send: function(cmd) {
      bPromptAppend = true;
      ws.send_string(cmd + '\n');
      if (echoMode) {
        msg('<span class="cmd">' + cmd + '</span>');
      }
    },

    silentSend: function(cmd) {
      bPromptAppend = true;
      ws.send_string(cmd + '\n');
    },

    connect: function(server, port) {
      ws.open('ws://' + server + ':' + port, ['binary', 'base64']);
      scope.server = server;
      scope.port = port;
    },

    disconnect: function() {
      ws.close();
    }


  };


}]);