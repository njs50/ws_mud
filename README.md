## ws_mud

A websocket based mud client.
A telnet->websocket proxy.

proxy is modified websockify node.js implementation (fixed some errors)
client uses websockify websocket implementation (flash fallback)

### usage

Proxy:
node /proxy/websockify.js node websockify.js webSocketServer:8000 telnetSource:4000

### demo

[http://njs50.github.io/ws_mud][]