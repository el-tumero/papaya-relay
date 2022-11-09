# Papaya Dapp Relay

Server for fowarding encrypted messages from senders to receiver via websockets. Manages status of users and stores their messages. Written in Typescript - uses Express and Socket.io libraries.

## Info

- The server uses the user's wallet signature for authentication.
- Messages are encrypted by ECDH algorithm

## Routes

- / - websocket route for communiation

- /online - (GET) shows currently online users (connected to this server)

- /messages?address=`wallet address` - (GET) shows messages send to user which wallet address is given in query param.

## Sockets

- *message* - is used for sending messages (client sends messages to this route)

- `your_wallet_address` - is used for receiveing messages (client with given wallet address uses this route for receiving messages)

## How to use

Use ```yarn bulld``` command to build a server and then use ```yarn start``` command to run it. In *.env* file you can specify a port (default is set to 3344)
