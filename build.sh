#!/bin/sh
cd ./client
npm install
./node_modules/.bin/grunt build
cd ../proxy
npm install
cd ..
docker build -t mud-proxy .