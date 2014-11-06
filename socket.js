function SOCKET() {

	this.ws = new WebSocket('ws://eoe-neodamus.rhcloud.com:8000');	
	this.ws.onopen = function() { getBlock('login').login(); }
	this.ws.onmessage = function(message) {	RECEIVE(message.data); }
	this.ws.onclose = function() { /*do nothing*/ console.log('closed socket'); }
}


// send websocket message
function SEND(id, data) {

	EOE.socket.ws.send( JSON.stringify( { id: id, data: data } ));
}


// receive websocket message
// @param data = { id, data }
function RECEIVE(data) {
	
	var packet = JSON.parse(data);	
	var id = packet.id;
	var data = packet.data;
	
	switch(id) {
		case 'loginSuccess': getBlock('login').loginSuccess(data); break;
		case 'usersList': getBlock('lobby-users').receiveUsersList(data); break;
		case 'chat': getBlock('lobby-chat').receiveChat(data); break;
		case 'UNITDATA': EOE.game.unitdata.set(data); break;
	}
}