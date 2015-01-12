function SOCKET() {
	
	var local = 'ws://localhost:8080';
	var live = 'ws://eoe-neodamus.rhcloud.com:8000';

	this.ws = new WebSocket(local);		
	this.ws.onopen = function() { 
		getBlock('login').login(); 
		if (EOE.images) { /* console.log('starting game'); EOE.game = new GAME(); */ } else { 
			//console.log('socket waiting for images'); 
		}
	}
	this.ws.onmessage = function(message) {	RECEIVE(message.data); }
	this.ws.onclose = function() { /*do nothing*/ console.log('closed socket'); }
}


// send websocket message
function SEND(id, data) {

	try {
		EOE.socket.ws.send( JSON.stringify( { id: id, data: data } ));
	} catch(err) {
		console.log( err.message + ' Packet being sent was ( id: ' + id + ', data: ' + data +  ' )' );
	}
}


// receive websocket message
// @param data = { id, data }
function RECEIVE(data) {
	
	var packet = JSON.parse(data);	
	var id = packet.id;
	var data = packet.data;
	
	// console.log(packet);
	
	switch(id) {
		case 'loginSuccess': getBlock('login').loginSuccess(data); break;
		case 'usersList': getBlock('lobby-users').receiveUsersList(data); break;
		case 'gamesList': getBlock('lobby-games').receiveGamesList(data); break;
		case 'chat': getBlock('lobby-chat').receiveChat(data); break;
		case 'UNITDATA': EOE.game.unitdata.set(data); break;
		case 'newGame': EOE.game = new GAME('live'); EOE.game.init(data.tiles); break;
		case 'setArmy': EOE.game.setArmy(data); break;
		case 'playersList': EOE.game.setPlayersList(data); break;
		case 'setPhase': EOE.game.setPhase(data); break;
		case 'selectionOrder': EOE.game.setSelectionOrder(data); break;
		case 'placementTiles': EOE.game.setPlacementTiles(data); break;
		case 'startTurn': EOE.game.startTurn(); break;
		case 'selectUnit': EOE.game.selectUnitResponse(data.id, data.type); break;
		case 'selectTile': EOE.game.selectTileResponse(data.tileId, data.unitId, data.activeTiles); break;
		case 'addUnit': EOE.game.addUnitResponse(data); break;
		case 'moveUnit': EOE.game.moveUnitResponse(data.unitId, data.tileId); break;
		case 'killUnit': EOE.game.killUnit(data); break;
		case 'gamestate': EOE.game.loadGamestateResponse(data.units, data.tiles); break;
		case 'endGame': EOE.game.end(); break;
	}
}