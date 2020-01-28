#!/usr/bin/env node
const WebSocketServer = require('websocket').server;
const http            = require('http');

let connections = {};

const server = http.createServer(function(request, response){
	console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});
server.listen(8080, function(){
	console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
	// applications, as it defeats all standard cross-origin protection
	// facilities built into the protocol and the browser.  You should
	// *always* verify the connection's origin and decide whether or not
	// to accept it.
	autoAcceptConnections: false
});

function originIsAllowed(origin){
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

wsServer.on('request', function(request){
	if(!originIsAllowed(request.origin)){
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}

	let connection           = request.accept('chat_1.0', request.origin);
	connection.key           = request.key;
	connections[request.key] = connection;

	console.log((new Date()) + ' Connection accepted.');
	connection.on('message', onMessageReceive);

	connection.on('close', function(reasonCode, description){
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
		sendMessageAll({type: 1, login: connections[this.key].login});
		delete connections[this.key];
	});
});

function sendMessageAll(message, without_key){
	for(let i in connections){
		if(connections.hasOwnProperty(i) && connections[i]){
			if(connections[i].key !== without_key){
				connections[i].send(JSON.stringify(message));
			}
		}
	}
}

function onMessageReceive(message){
	if(message.type === 'utf8'){
		console.log('Received Message: ' + message.utf8Data);
		let data = JSON.parse(message.utf8Data);

		switch(data.type){
			case 0: //Регистрация нового клиента в чате
				connections[this.key].login = data.login;

				//Рассыл на всех, что у нас новый посетитель
				sendMessageAll({type: 0, login: data.login});
				break;

			case 1: //Выход из чата
				connections[this.key].login = data.login;

				//Рассыл на всех, что у нас новый посетитель
				sendMessageAll({type: 1, login: data.login}, this.key);
				break;

			case 2: //Сообщение в чат
				connections[this.key].login = data.login;

				//Рассыл на всех, что у нас новый посетитель
				sendMessageAll({type: 2, login: data.login, message: data.message}, this.key);
				break;
		}

		// connection.sendUTF(message.utf8Data);

	}else if(message.type === 'binary'){
		console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
		// connection.sendBytes(message.binaryData);
	}
}