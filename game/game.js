// GAME will control all components and handle data flow between components and/or server, as much game logic as is needed on client
function GAME(mode) {

	// GAME MODE
	this.mode = mode;  						// 'live', 'test'
	
	// COMPONENTS
	this.board = new BOARD(this);
	this.ui = new UI(this);	
	this.unitdata = new UNITDATA();
	//this.abilitydata = new ABILITYDATA();
	
	// TICKER
	var update = function() { this.update(); }
	createjs.Ticker.setFPS(20);
	createjs.Ticker.addEventListener("tick", update.bind(this));
	
	// GAMEPLAY VARIABLES		
	this.widthTiles = 7;					// dimensions of board -- must be odd numbers -- h + 1 = 2w
	this.heightTiles = 13;
	
	this.tiles = [];						// [ TILE ]
	this.units = [];						// [ UNIT ]	
	this.selectedTile = null;				// (TILE)
	this.selectedUnit = null;				// (UNIT)	
	this.activeAbility;						// (ABILITY)
	this.currentTargets;					// [ tileId, unitId (if unit is on tile) ]
	this.actionQueue = [];					// holds the actions to be sent at the end of turn
	this.ready = false;						// holds whether player is ready to end turn or not
	
	// TEST MODE VARIABLES
	this.activeArmy = 1;					// used to decide which army is currently active
	this.mousemode = 'game'; 				// used to determine what left and right click actions will be used	
	
	// game start functions
	if (this.mode == 'test') { SEND('newgame') };
}


// run when a newgame response is received
GAME.prototype.init = function(tiles, units) {
	
	// create empty tiles with just id's, rest of tile properties will be manipulated from server or board
	for (var i = 0; i < 127; i++) {
		var tile = new TILE(i);
		this.tiles.push(tile);	
	}
	
	// add data from server gamestate
	for (var i = 0; i < tiles.length; i++) {
		var localTile = this.tiles[i];
		var serverTile = tiles[i];
		
		localTile.x = serverTile.x;
		localTile.y = serverTile.y; 
	}
	
	// give block reference to game
	getBlock('epoch-game').game = this;	
	
	// change display layout
	EOE.display.changeLayout('game');
	
	// setup tiles to be able to communicate with board -- @IMPORTANT this must be run after the layout has been activated
	this.board.initTiles();
}


// @TODO there probably needs to be 2 separate requests for each game mode
GAME.prototype.addUnitRequest = function(tileId, type, attributes) {
		
	SEND('addUnit', { tileId: tileId, army: this.activeArmy, type: type } );	
}


// @TODO this can probably be removed and replaced by loading gamestates on every added unit
GAME.prototype.addUnitResponse = function(data) {	
	
	// setup variables
	var id = JSON.parse(data.id);
	var tileId = data.tileId;
	var type = data.type;
	var army = data.army;	
	
	// add unit bitmap to board
	var tile = this.tiles[tileId];
	this.board.addUnitBitmap(tile, type);
	//this.board.addUnit(unit.tileId, unit.type);
	
	// create unit and add to units list
	var unit = new UNIT(id, tileId, type, army);
	this.units.push(unit);
	
	// tile needs to be able to reference unit
	tile.unit = unit;	
}


//
GAME.prototype.selectTileRequest = function(selectedTile) { 
	
	// setup selected tile and unit variables/display
	this.selectedTile = selectedTile;
	if (this.selectedTile.unit) { 
		var selectedUnit = this.selectedTile.unit;
		this.selectedUnit = selectedUnit;
		this.ui.setUnit(selectedUnit);
	};			
	
	// remove types from all active tiles since new active tiles will be coming in response
	for (var i = 0; i < this.tiles.length; i++) {		
		var tile = this.tiles[i];		
		if (tile.type) { delete tile.type; }
	}
	
	// send to server
	SEND('selectTile', selectedTile.id); 
}


// @param activeTiles -- [ { tileId, tileType } ]
GAME.prototype.selectTileResponse = function(tileId, unitId, activeTiles) {
	
	// add the active tile bitmaps
	if (activeTiles != undefined) {	this.board.setActiveTileBitmaps(activeTiles); }
	
	// add types to all active tiles
	for (var i = 0; i < activeTiles.length; i++) {
		
		var activeTile = activeTiles[i];
		var tileId = activeTile.tileId;
		var tileType = activeTile.tileType;
		
		this.tiles[tileId].type = tileType;			
	}
}


//
GAME.prototype.abilityRequest = function(abilityType, targetTile) {
	
	SEND('ability', { abilityType: abilityType, sourceTileId: this.selectedUnit.tileId, targetTileIds: [ targetTile.id ] } );	
}


// start the turn
GAME.prototype.startTurn = function() {
	
	// set ready status
	this.setReady(false);
	$('#epoch-ui .timer .ready').html('Ready');
			
	// remove active tiles
	this.board.removeActiveTileBitmaps();
}


// sets the ready status of the game
GAME.prototype.setReady = function(readyStatus) {
	
	if (readyStatus) {
		this.ready = readyStatus;
		SEND('ready', true);
	} else {
		this.ready = readyStatus;
		SEND('ready', false);	
	}
}


// sends server request to save current game state
GAME.prototype.saveGamestateRequest = function() {	SEND('saveGamestate'); }


// sends server request to load current game state @TODO: will need additional parameters as additional saved gamestates are needed
GAME.prototype.loadGamestateRequest = function() {	SEND('loadGamestate'); }


// loads gamestate, gamestates are sent from server
// gamestate assets arrive as objects, should be unnecessary to change them into TILES/UNITS since no logic should be occurring in client
// only object properties should be required for data output, which means no class functions should be needed
GAME.prototype.loadGamestateResponse = function(units, tiles) {
	
	// store unit variables
	if (this.selectedUnit) { var selectedUnitId = this.selectedUnit.id; }
	
	// copy tile data, remove any unit references from previous
	for (var i = 0; i < tiles.length; i++) {
		var loadedTile = tiles[i];
		var tile = this.tiles[i];
		
		//remove all unit references from tiles that no longer have units
		var unit = loadedTile.unit;
		if (unit) { tile.unit = unit; } else { delete tile.unit; }
	}
		
	// copy unit data
	this.units = [];
	for (var i = 0; i < units.length; i++) {	
		var unit = JSON.parse(JSON.stringify(units[i]));
		
		// @TODO temporary to test ranged functionality
		if (unit.type == 'sharpshooter') {
			unit.defaultAbility = new ABILITY('ranged_attack', this);
		} else {
			unit.defaultAbility = new ABILITY('melee_attack', this);			
		}
		// end test
		
		
		this.units.push(unit);		
	}
	
	// connect tiles to their units
	for (var i = 0; i < this.units.length; i++) {
		var unit = this.units[i];
		if (unit.tileId) { var tile = this.tiles[unit.tileId]; tile.unit = unit; }			
	}
	
	
	// set unit variables
	if (selectedUnitId) { this.selectedUnit = this.units[selectedUnitId]; }
	
	// tell board to change bitmaps based on loaded gamestate
	this.board.loadGamestate();	
}


// the id of the units will not match up with the array index since their id will be given by the server, not locally
// @param unitId - (int)
// @return unit - (UNIT)
GAME.prototype.getUnitById = function(unitId) {
	
	var unit;
	
	for (var i = 0; i < this.units.length; i++) {
		
		var testUnit = this.units[i];
		var testId = testUnit.id;
		if (unitId == testId) { unit = testUnit;  i = this.units.length+1; }
		
	}

	return unit;
	
}


// used to get tileId by coordinates passed in by UI
GAME.prototype.getTileByCoord = function(x, y) {	
	
	var tile;
		
	for (var i = 0; i < this.tiles.length; i++) {
		var tempTile = this.tiles[i];
		
		if (tempTile.boardX == x && tempTile.boardY == y) { tile = tempTile; }
	}
	
	return tile;	
}


GAME.prototype.click = function(x, y) {	
	
	// setup variables
	var tile = this.getTileByCoord(x, y);
	
	if (this.mousemode == 'create') {
		
		var unit = getBlock('epoch-editor').selectedUnit;
		unit != '' ? this.addUnitRequest(tile.id, unit) : false;		
		
	} else if (this.mousemode == 'game') {
		this.board.removeActiveTileBitmaps();
		this.selectTileRequest(tile);
	}	
}


GAME.prototype.rightclick = function(x, y) {
	
	// setup variables
	var tile = this.getTileByCoord(x, y);	
	var type = tile.type;
	
	if (this.mousemode == 'create') {
		
		this.addUnit(tileId, getBlock('epoch-editor').selectedUnit);
		
	} else if (this.mousemode == 'game') {
		
		var sourceUnit = this.selectedUnit;
		var targetUnit = tile.unit;
		
		switch (type) {
			case 'move': this.abilityRequest('move', tile); break;
			case 'enemy': this.abilityRequest( this.selectedUnit.defaultAbility.type, tile ); break;
		}
	}
		
}


//
GAME.prototype.resize = function(width, height) { this.board.resize(width, height); this.ui.resize(width, height); }


//
GAME.prototype.update = function() { this.board.update(); }

