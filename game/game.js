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
	
	this.selectedUnit;		// (UNIT)	
	
	getBlock('epoch-game').game = this;
	
	console.log('game created');
}


GAME.prototype.selectTile = function(tile) {
	
	var unit = tile.unit;

	if (unit) {
		this.selectedUnit = unit;
		this.board.setMoveTiles(unit);
		this.ui.setUnit(unit);	
	} else {
		this.selectedUnit = null;			
	}
	
}


GAME.prototype.addUnitRequest = function(tileId, type, attributes) {
	
	var units = this.units;
	var id = units.length;
	
	var unit = new UNIT(id, tileId, type, attributes);
	SEND('addUnit', unit);
	
}


GAME.prototype.addUnitResponse = function(unit) {
	
	// add unit bitmap to board, receive tile where it was created
	var tile = this.board.addUnit(unit.tileId, unit.type);
	tile.unit = unit;
	
	// add to units list
	var units = this.units;
	units.push(unit);		
}


GAME.prototype.removeUnit = function(tileId) {
		
}


GAME.prototype.resize = function(width, height) {
	this.board.resize(width, height);
}


GAME.prototype.update = function() {
	this.board.update();	
}

