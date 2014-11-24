// GAME will control all components and handle information between components + server communication

function GAME(mode) {

	this.mode = mode;  // live, test
	
	// components
	this.board = new BOARD();
	this.ui = new UI();	
	this.units = [ ];
	this.unitdata = new UNITDATA();
	//this.abilitydata = new ABILITYDATA();
	this.actionQueue = [];	// holds the actions to be sent at the end of turn
	
	// update ticker
	var update = function() { this.update(); }
	createjs.Ticker.setFPS(20);
	createjs.Ticker.addEventListener("tick", update.bind(this));
	
	// units
	this.army1Units = [];	// @QUESTION will this just be for test mode? is there a reason for client to know enemy units?
	this.army2Units = [];	// @QUESTION will this just be for test mode? is there a reason for client to know enemy units?
	this.activeArmy = 1;	// [TEST MODE] used to decide which army is currently active
	this.selectedUnit;		// (UNIT)	
	
	getBlock('epoch-game').game = this;
}


GAME.prototype.addUnitRequest = function(tileId, type, attributes) {
	
	// @QUESTION there probably needs to be 2 separate requests for each mode
	
	var units = this.units;
	var id = units.length;
	
	var unit = new UNIT(id, tileId, type, attributes);
	SEND('addUnit', { army: this.activeArmy, unit: unit } );
	
}


GAME.prototype.addUnitResponse = function(data) {
	
	var army = data.army;
	var unit = data.unit;
	
	// add unit bitmap to board, receive tile where it was created
	var tile = this.board.addUnit(unit.tileId, unit.type);
	tile.unit = unit;
	
	// add to units list
	var units = army == 1 ? this.army1Units : this.army2Units;
	units.push(unit);
	
	console.log(this.army1Units);
	console.log(this.army2Units);		
}


GAME.prototype.removeUnit = function(tileId) {
		
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


GAME.prototype.moveUnitRequest = function(unit, destinationTileId) {
	
	this.actionQueue.push( { id: 'moveUnit', data: { unitId: unit.id, tileId: destinationTileId } } );
}


GAME.prototype.sendActionQueue = function() {
	SEND( 'actionQueue', this.actionQueue );	
}


GAME.prototype.resize = function(width, height) {
	this.board.resize(width, height);
}


GAME.prototype.update = function() {
	this.board.update();	
}

