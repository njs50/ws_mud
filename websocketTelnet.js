
//


function Telnet(args) {

    /* Initialize Websock object */
    var ws = new Websock();

    ws.on('message', function(){
        dataHandler(ws.rQshiftBytes(ws.rQlen()));
    });

    ws.on('open', function() {
        Util.Info(">> WebSockets.onopen");
        //connect_callback();
        Util.Info("<< WebSockets.onopen");
    });

    ws.on('close', function() {
        Util.Info(">> WebSockets.onclose");
        //that.disconnect();
        Util.Info("<< WebSockets.onclose");
    });

    ws.on('error', function() {
        Util.Info(">> WebSockets.onerror");
        //that.disconnect();
        Util.Info("<< WebSockets.onerror");
    });


    // private
    var state = 0;
    var block_buffer = "";
    var echoMode = 1;
    var openSpans = 0;
    var bPromptAppend = false;

    var eventHandlers = {
        log: function() {},
        reset: function() {},
        parse_line: function() {},
        parse_prompt: function() {},
        parse_block: function() {},
        add_line: function() {},
        append_line: function() {}
    };


    var closeSpans = function() {
        var rs = '';
        if (openSpans > 0) {
            while(openSpans-- > 0) {
                rs += '</span>';
            }
        }
        return rs;
    };


    var msg = function(ansiText) {
        // if the current line is a prompt then append output onto it.
        if (bPromptAppend) {
            eventHandlers.append_line( ansiText + closeSpans() );
            bPromptAppend = false;
        } else {
            eventHandlers.add_line( ansiText + closeSpans() );
        }
    };




    var dataHandler = function(aBytes) {

        var buffer =  "";
        var line_buffer = "";
        var ansi_line_buffer = '';

        // Loop through each available byte returned from the socket connection.
        for(var pos = 0; pos < aBytes.length; pos++) {

            // Read next available byte.
            var b = aBytes[pos];

            switch (state) {

            case 0:
                    // If the current byte is the "Interpret as Command" code, set the state to 1.
                if (b === Telnet.IAC) {
                    state = 1;
                // if the current byte is the escape char set the state and process ansi chars etc
                } else if (b === Telnet.ECHO){
                    if (echoMode === 0) {
                        echoMode = 1;
                    } else  {
                        echoMode = 0;
                    }
                } else if (b === Telnet.ESC) {
                    state = 3;
                }
                // Else, if the byte is not a carriage return, display the character using the msg() method.
                else {

                    // if this char is a linefeed then process the line...
                    if (b === Telnet.LF) {
                        // output the line in the buffer
                        msg(ansi_line_buffer);

                        // add this line to the block buffer
                        if (line_buffer.length > 0) {
                            block_buffer += line_buffer + '\n';
                        }

                        // reset the line buffers
                        line_buffer = "";
                        ansi_line_buffer = "";

                    } else {

                        // add this char to the line buffer as long as it aint a newline char
                        if (b !== Telnet.CR){
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
                ws.send([Telnet.IAC,Telnet.WONT,b]);
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
                else if (String.fromCharCode(b) === 'c'){
                    eventHandlers.reset();
                }
                /* assorted other things that arn't implemented... */
                else if (String.fromCharCode(b) === 'M') { jsLog('[Scroll Up]'); }
                else if (String.fromCharCode(b) === 'D') { jsLog('[Scroll Down]'); }
                else if (String.fromCharCode(b) === 'H') { jsLog('[Set Tab]'); }
                else if (String.fromCharCode(b) === '8') { jsLog('[Restore Cursor & Attrs]'); }
                else if (String.fromCharCode(b) === '7') { jsLog('[Save Cursor & Attrs]'); }
                else if (String.fromCharCode(b) === ')') { jsLog('[Font Set G0]'); }
                else if (String.fromCharCode(b) === '(') { jsLog('[Font Set G1]'); }
                else {
                    eventHandlers.log('[unknown escape code : ' + b + ']');
                }

                state = 0;

                break;

            case 4:

                /* we only like 0-9 and ; to be attached to our commands */
                if ( (b >= 48 && b <= 57) || b === 59) {
                    buffer += String.fromCharCode(b);
                }
                /* change font color etc */
                else if (String.fromCharCode(b) === 'm'){
                    //ansi_line_buffer += String.fromCharCode(ESC) + '[' + buffer + 'm';

                    var bold_mod = 0;
                    var class_list  = '';
                    var aBuffer = buffer.split(';');

                    // resort buffer so that commands (resets and bolds etc) happen before setting colors
                    aBuffer.sort(function(x,y) { return parseInt(x,10) - parseInt(y,10); } );

                    for(i =0; i < aBuffer.length; i++) {

                        var ansiCode = parseInt(aBuffer[i],10);

                        if ( ansiCode === 0 ) {
                            ansi_line_buffer += closeSpans();
                        }

                        // bight intensity
                        if ( ansiCode === 1) {  bold_mod = 8; }

                        // normal or feint intensity
                        if ( ansiCode === 2 || ansiCode === 22) { bold_mod = 0; }

                        // underline
                        if ( ansiCode === 3) { class_list += 'italic '; }

                        // underline
                        if ( ansiCode === 4) { class_list += 'uline '; }

                        // underline
                        if ( ansiCode === 5 || ansiCode === 6) { class_list += 'blink '; }

                        // reverse colours
                        if ( ansiCode === 7) { class_list = 'fg8 bg1'; }

                        // underline
                        if ( ansiCode === 9) { class_list += 'strikethrough '; }


                        // FG color change
                        if ( ansiCode <= 37 && ansiCode >= 30) { class_list += 'fg' + (ansiCode - 29 + bold_mod); }

                        // BG color change
                        if ( ansiCode <= 47 && ansiCode >= 40) { class_list += 'bg' + (ansiCode - 39 + bold_mod); }

                    }

                    if(class_list.length > 0) {
                        ansi_line_buffer += '<span class="' + class_list + '">';
                        openSpans++;
                    }

                    state = 0;
                } else {
                    // ignoring all ansi codes other than color changes!
                    eventHandlers.log('[ansi:' + buffer + String.fromCharCode(b) + ']');
                    state = 0;
                }

                break;

            } // end of state switch

        }


        // do prompt parsing stuff here (leftover stuff in the line buffer = prompt
        // make sure prompt is valid...
        if (ansi_line_buffer !== "") {

            // display the prompt
            msg(ansi_line_buffer);

            // this prompt detection looks super dodgy...
            if (    ( line_buffer.indexOf('<') > -1 && line_buffer.indexOf('>') > -1) ||
                    ( line_buffer.indexOf('Choice:') > -1 ) ||
                    ( line_buffer.indexOf('Password:') > -1 )
                ){



                // parse the block and each line in it (minus prompt)
                if (block_buffer.length > 0){

                    // parse each line in the block
                    var aLines = block_buffer.split('\n');
                    for (var l = 0; l < aLines.length; l++ ){
                        eventHandlers.parse_line(aLines[l]);
                    }

                    // parse the entire block
                    eventHandlers.parse_block(block_buffer);

                    block_buffer = "";
                }

                // parse the prompt (now we know it's valid)
                eventHandlers.parse_prompt(line_buffer);


                bPromptAppend = false;

             // this isn't a valid prompt so append the next line onto it
            }  else {
                bPromptAppend = true;
                // msg("[bad prompt]");
            }

        }

    };


    var public = {

        open: function(args) {
            ws.open('ws://' + args.host + ':' + args.port, ['binary','base64']);
        },

        // Set event handlers
        on: function(evt, handler) {
            eventHandlers[evt] = handler;
        },

        sendText: function(text) {
            // check aliases for this command before sending to the mud

            ws.send_string(text + '\n');
            if (echoMode === 1) {
                msg( text );
            }

        }

    };

    return public;

}


Telnet.ECHO = 1; // toggle local echo mode?
Telnet.LF = 10; // Line Feed (LF)
Telnet.CR = 13; // Carriage Return (CR)

Telnet.ESC = 0x1B; //escape character

Telnet.WILL = 0xFB; // 251 - WILL (option code)
Telnet.WONT = 0xFC; // 252 - WON'T (option code)
Telnet.DO   = 0xFD; // 253 - DO (option code)
Telnet.DONT = 0xFE; // 254 - DON'T (option code)
Telnet.IAC  = 0xFF; // 255 - Interpret as Command (IAC)

