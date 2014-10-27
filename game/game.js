// GAME will control all components and handle information between components + server communication

function GAME(mode) {

	this.mode = mode;  // live, test
	
	// components
	this.board = new BOARD();
	this.ui = new UI();	
	this.units = [ ];
	this.unitdata = new UNITDATA();
	//this.abilitydata = new ABILITYDATA();
	
	// update ticker
	var update = function() { this.update(); }
	createjs.Ticker.setFPS(20);
	createjs.Ticker.addEventListener("tick", update.bind(this));	
}


GAME.prototype.tileSelect = function(tile) {

	if (tile.unit) {
		this.ui.setUnit(tile.unit);	
	}
	
}


GAME.prototype.addUnit = function(tileId, type, attributes) {
	
	var units = this.units;
	var id = units.length;
	
	var unit = new UNIT(id, tileId, type, attributes);
	units.push(unit);
	
	// add unit bitmap to board, receive tile where it was created
	var tile = this.board.addUnit(tileId, type);
	tile.unit = unit;
	
}


GAME.prototype.resize = function(width, height) {
	this.board.resize(width, height);
}


GAME.prototype.update = function() {
	this.board.update();	
}

