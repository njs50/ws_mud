#!/usr/bin/env node

// A WebSocket to TCP socket proxy
// Copyright 2012 Joel Martin
// Licensed under LGPL version 3 (see docs/LICENSE.LGPL-3)

// Known to work with node 0.8.9
// Requires node modules: ws, optimist and policyfile
//     npm install ws optimist policyfile
//
// NOTE:
// This version requires a patched version of einaros/ws that supports
// subprotocol negotiation. You can use the patched version like this:
//
//     cd websockify/other
//     git clone https://github.com/kanaka/ws
//     npm link ./ws


var argv = require('optimist').argv,
    net = require('net'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),

    Buffer = require('buffer').Buffer,
    WebSocketServer = require('ws').Server,

    webServer, wsServer,
    source_host, source_port, target_host, target_port;



// Handle new WebSocket client
var new_client = function(client) {

    var clientAddr = client._socket.remoteAddress, log;
    log = function (msg) {
        console.log(' ' + clientAddr + ': '+ msg);
    };

    log('WebSocket connection');
    log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol);

    var target = net.createConnection(target_port,target_host, function() {
        log('connected to target');
    });

    target.on('data', function(data) {
        //log("sending message: " + data);
        try {
            if (client.protocol === 'base64') {
                client.send(new Buffer(data).toString('base64'));
            } else {
                client.send(data,{binary: true});
            }
        } catch(e) {
            log("remote closed, cleaning up target");
            target.end();
        }
    });

    target.on('end', function() {
        log('target disconnected');
    });

    target.on('error', function(a) {
        log('Target socket error: ' + a);
        target.end();
        client.terminate();
    });

    client.on('message', function(msg) {
        //log('got message: ' + msg);
        try {
            if (client.protocol === 'base64') {
                target.write(new Buffer(msg, 'base64'));
            } else {
                target.write(msg,'binary');
            }
        } catch(e) {
            log("Client closed, cleaning up target");
            target.end();
            client.terminate();
        }
    });

    client.on('close', function(code, reason) {
        log('WebSocket client disconnected: ' + code + ' [' + reason + ']');
        target.end();
    });

    client.on('error', function(a) {
        log('WebSocket client error: ' + a);
        target.end();
    });

};


// Send an HTTP error response
http_error = function (response, code, msg) {
    response.writeHead(code, {"Content-Type": "text/plain"});
    response.write(msg + "\n");
    response.end();
    return;
};

// Process an HTTP static file request
http_request = function (request, response) {
//    console.log("pathname: " + url.parse(req.url).pathname);
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.end('okay');

    if (! argv.web) {
        return http_error(response, 403, "403 Permission Denied");
    }

    var uri = url.parse(request.url).pathname;
    var filename = path.join(argv.web, uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            return http_error(response, 404, "404 Not Found");
        }

        if (fs.statSync(filename).isDirectory()) {
            filename += '/index.html';
        }

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                return http_error(response, 500, err);
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
};

// Select 'binary' or 'base64' subprotocol, preferring 'binary'
selectProtocol = function(plist, request) {
    if (plist.indexOf('binary') >= 0) {
        return 'binary';
    } else if (plist.indexOf('base64') >= 0) {
        return 'base64';
    } else {
        console.log("Client must support 'binary' or 'base64' protocol");
    }
};

// parse source and target arguments into parts
try {
    source_arg = argv._[0].toString();
    target_arg = argv._[1].toString();

    var idx;
    idx = source_arg.indexOf(":");
    if (idx >= 0) {
        source_host = source_arg.slice(0, idx);
        source_port = parseInt(source_arg.slice(idx+1), 10);
    } else {
        source_host = "";
        source_port = parseInt(source_arg, 10);
    }

    idx = target_arg.indexOf(":");
    if (idx < 0) {
        throw("target must be host:port");
    }
    target_host = target_arg.slice(0, idx);
    target_port = parseInt(target_arg.slice(idx+1), 10);

    if (isNaN(source_port) || isNaN(target_port)) {
        throw("illegal port");
    }
} catch(e) {
    console.error("websockify.js [--web web_dir] [--cert cert.pem [--key key.pem]] [source_addr:]source_port target_addr:target_port");
    process.exit(2);
}

console.log("WebSocket settings: ");
console.log("    - proxying from " + source_host + ":" + source_port +
            " to " + target_host + ":" + target_port);
if (argv.web) {
    console.log("    - Web server active. Serving: " + argv.web);
}

if (argv.cert) {
    argv.key = argv.key || argv.cert;
    var cert = fs.readFileSync(argv.cert),
        key = fs.readFileSync(argv.key);
    console.log("    - Running in encrypted HTTPS (wss://) mode using: " + argv.cert + ", " + argv.key);
    webServer = https.createServer({cert: cert, key: key}, http_request);
} else {
    console.log("    - Running in unencrypted HTTP (ws://) mode");
    webServer = http.createServer(http_request);
}
webServer.listen(source_port, function() {
    wsServer = new WebSocketServer({server: webServer, handleProtocols: selectProtocol});
    wsServer.on('connection', new_client);
});

