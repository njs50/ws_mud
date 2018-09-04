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
(it expects the client to already be built at client/dist )

## copy config to docker host (nb: machine name and username are both rancher)
docker-machine scp -r ./config rancher:/home/rancher/config

### building
docker build -t mud-proxy .

### removing running instance
docker-compose stop
docker-compose rm

## starting up (incl nginx proxy w/ letsencrypt for https)
docker-compose up -d

## replacing mud-proxy without changing other services
docker-compose up -d --no-deps --build mud-proxy
