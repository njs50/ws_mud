## ws_mud

A websocket based mud client.
A telnet->websocket proxy.

proxy is modified websockify node.js implementation (fixed some errors)
client uses websockify websocket implementation (flash fallback)

### usage

Proxy:
node /proxy/websockify.js node websockify.js webSocketServer:8000 telnetSource:4000

### demo

[http://njs50.github.io/ws_mud/]

## docker info
in case you wanted to play with this dockerfile....
(it expects the client to already be build at client/dist )

### building
docker build -t mud-proxy .

### removing running instance
docker stop mud-proxy
docker rm mud-proxy

### running...
docker run -d -it -p 8000:8000/tcp -p 8000:8000/udp --name=mud-proxy --restart=always mud-proxy
