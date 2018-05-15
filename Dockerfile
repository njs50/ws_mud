FROM node:9-alpine
RUN apk add --update tini

# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

# Copy application files
COPY ./proxy ./
COPY ./client/dist ./dist/

RUN npm install

EXPOSE 8000/tcp
EXPOSE 8000/udp

# Run your program under Tini
CMD [ "node", "proxy.js", "--web", "./dist/", "0.0.0.0:8000", "theforestsedge.com:4000" ]
