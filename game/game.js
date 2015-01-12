// GAME will control all components and handle data flow between components and/or server, as much game logic as is needed on client
function GAME(mode) {

	// GAME MODE
	this.mode = mode;  						// 'live', 'test'
	this.status;							// 0 - paused, 1 - running
	
	// COMPONENTS
	this.board = new BOARD(this);
	this.ui = new UI(this);	
	this.unitdata = new UNITDATA();
	//this.abilitydata = new ABILITYDATA();
	
	// GLOBALS
	this.elements = [ 'fire', 'air', 'earth', 'lightning', 'water' ];
	
	// GAMEPLAY VARIABLES		
	this.widthTiles = 7;					// dimensions of board -- must be odd numbers -- h + 1 = 2w
	this.heightTiles = 13;
	
	this.tiles = [];						// [ TILE ]
	this.units = [];						// [ UNIT ]	
	
	this.phase = '';						// holds the current phase the game is in -- 'selection', 'placement', 'game', 'end'
	
	this.selectedTile = null;				// (TILE)
	this.selectedUnit = null;				// (UNIT)	
	this.activeAbility;						// (ABILITY)
	this.currentTargets;					// [ tileId, unitId (if unit is on tile) ]
	this.actionQueue = [];					// holds the actions to be sent at the end of turn
	this.ready = false;						// holds whether player is ready to end turn or not
	
	// LIVE MODE VARIABLES
	this.army;								// (int) holds which army this client is
	this.playersList = [];					// holds playersList
	
	// TEST MODE VARIABLES
	this.activeArmy = 1;					// used to decide which army is currently active
	this.mousemode = 'game'; 				// used to determine what left and right click actions will be used	
	
	// enter
	document.addEventListener('keypress', function(evt) {

        if (evt.keyCode == 13) {

            EOE.game.setReady(!EOE.game.ready);
        }
    });
	
	// game start functions
	if (this.mode == 'test') { SEND('newgame') };
}


// run when a newgame response is received
GAME.prototype.init = function(tiles) {
	
	// set status to running
	this.setStatus(1);
	
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
}


// set the status of the game
// INT statusId - 0 = stopped, 1 = running
GAME.prototype.setStatus = function(statusId) {
	
	this.status = statusId;

	switch (statusId) {
		case 0:	
		
			// stop ticker and remove all listeners
		 	createjs.Ticker.reset();		
							
		break;
		
		case 1: 
		
			// add ticker listener and set frame rate
			var update = function() { this.update(true); }
			createjs.Ticker.addEventListener("tick", update.bind(this));
						
		break;
	}	
}


// set army value of game, received by server at start of game
GAME.prototype.setArmy = function(army) {
	this.army = army;
}


// set list of players in game
GAME.prototype.setPlayersList = function(playersList) {
	this.playersList = playersList;	
}


// set phase of game
GAME.prototype.setPhase = function(phase) {
	
	this.phase = phase;
	
	switch (phase) {
		
		case 'selection': 
		
			// change display layout
			EOE.display.changeLayout('game');
			
			// start selection ui
			this.ui.startSelection();
		
		break;
		
		case 'placement':
			
			// setup tiles to be able to communicate with board -- @IMPORTANT this must be run after the layout has been activated
			this.board.initTiles();	
			
			// start placement ui
			this.ui.startPlacement();
		
		break;
	
		case 'combat':	
			
			// start combat ui
			this.ui.startCombat(); 
				
		break;	
	}
		
}


// @BREAK
GAME.prototype.setSelectionOrder = function(selectionOrder) {
	this.selectionOrder = selectionOrder;
	console.log(this);	
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


// used during selection phase to request units being selected
GAME.prototype.selectUnitRequest = function(type) {
	SEND('selectUnit', type);
}


// used during selection phase for handling selectUnit responses
GAME.prototype.selectUnitResponse = function(id, type) {
	
}


// used during selection phase to request units being unselected
GAME.prototype.unselectUnitRequest = function(id) {
	SEND('unselectUnit', id);
}


// used during selection phase for handling unselectUnit responses
GAME.prototype.unselectUnitResponse = function(id) {
	
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


// 
GAME.prototype.setPlacementTiles = function(placementTiles) {
	this.board.setActiveTileBitmaps(placementTiles);
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
	this.ready = false;
	$('#epoch-ui .timer .ready').html('Ready');
			
	// remove active tiles
	if (this.phase == 'combat') { this.board.removeActiveTileBitmaps(); }
}


// sets the ready status of the game
GAME.prototype.setReady = function(readyStatus) {
	
	if (readyStatus) {
		
		// validate that all units are placed
		if (this.phase == 'placement') {
			
			var allUnitsPlaced = true;
			
			var validateUnitPlacement = function(placeableUnit) {
				var unit = this.units[placeableUnit.id];
				if (unit.tileId == undefined) { allUnitsPlaced = false; }
			}
			this.ui.placeableUnits.forEach( validateUnitPlacement, this );
			
			if (!allUnitsPlaced) { alert('Not all units are placed'); return; }
		}
				
		this.ready = readyStatus;
		SEND('ready', true);
	} else {
		this.ready = readyStatus;
		SEND('ready', false);	
	}
				
	// sets text of ready button -- is being set here because it will be set by websocket between phases
	var readyButton = $('#epoch-ui .timer .ready');
	var readyButtonHtml = this.ready ? 'Not Ready' : 'Ready';
	readyButton.html(readyButtonHtml); 	
}


// sends server request to save current game state
GAME.prototype.saveGamestateRequest = function() {	SEND('saveGamestate'); }


// sends server request to load current game state
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
	
	
	// handle board display
	this.board.loadGamestate();
}


//
GAME.prototype.end = function() {
	
	// set status of game to paused
	this.setStatus(0);
	
	// change layout
	EOE.display.setActiveLayout('lobby');
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
		
		if (this.phase == 'placement') {
			
			// send server message to place unit
			var placeableUnitId = $('#epoch-ui .placement-bar .selected').attr('id');
			var unit = this.ui.placeableUnits[placeableUnitId];
			if (!tile.unit) { SEND('placeUnit', { tileId: tile.id, unitId: unit.id }); }
			
			// add placed class to image
			var placedUnitImage = $('#epoch-ui .placement-bar #' + placeableUnitId + ' img:first-child').addClass('placed');
			
			// select next placeable unit
			var unitSelected = false;
			var placedUnit = unit;
			this.ui.placementBar.children().removeClass('selected');			
			var selectNextPlaceableUnit = function(placeableUnit, index) {
				var unit = this.units[placeableUnit.id];
				
				var unitJustPlaced = placedUnit.id == placeableUnit.id;				
								
				if (unit.tileId == undefined && !unitSelected && !unitJustPlaced) {					
					this.ui.placementBar.children('#' + index).addClass('selected'); 
					unitSelected = true;
				}
			}
			this.ui.placeableUnits.forEach( selectNextPlaceableUnit, this );
			
			
		} else if (this.phase == 'combat') {
			this.board.removeActiveTileBitmaps();
			this.selectTileRequest(tile);
		}
	}	
}


GAME.prototype.rightclick = function(x, y) {
	
	// setup variables
	var tile = this.getTileByCoord(x, y);	
	var type = tile.type;
	
	if (this.mousemode == 'create') {
		
		this.addUnit(tileId, getBlock('epoch-editor').selectedUnit);
		
	} else if (this.mousemode == 'game') {
		
		if (this.phase == 'placement') {
			
			if (tile.unit) { SEND('unplaceUnit', tile.unit.id); }
			
			// remove placed class from image
			var placeableUnitIndex;
			var getPlaceableUnitIndex = function(placeableUnit, index) {
				if (placeableUnit.id == tile.unit.id) { placeableUnitIndex = index; }
			}
			this.ui.placeableUnits.forEach(getPlaceableUnitIndex);
			var placedUnitImage = $('#epoch-ui .placement-bar #' + placeableUnitIndex + ' img:first-child').removeClass('placed');
			
			
			// select next placeable unit
			var unitSelected = false;
			var unplacedUnit = tile.unit;
			this.ui.placementBar.children().removeClass('selected');			
			var selectNextPlaceableUnit = function(placeableUnit, index) {
				var unit = this.units[placeableUnit.id];
				
				var unitJustUnplaced = unplacedUnit.id == placeableUnit.id;				
								
				if ( (unit.tileId == undefined || unitJustUnplaced) && !unitSelected ) {					
					this.ui.placementBar.children('#' + index).addClass('selected'); 
					unitSelected = true;
				}
			}
			this.ui.placeableUnits.forEach( selectNextPlaceableUnit, this );
			
		} else if (this.phase == 'combat') {
		
			var sourceUnit = this.selectedUnit;
			var targetUnit = tile.unit;
			
			switch (type) {
				case 'move': this.abilityRequest('move', tile); break;
				case 'enemy': this.abilityRequest( this.selectedUnit.defaultAbility.type, tile ); break;
			}
		
		}
	}
		
}


//
GAME.prototype.resize = function(width, height) { this.board.resize(width, height); this.ui.resize(width, height); }


//
GAME.prototype.update = function() { if (this.status != 0) { this.board.update(); } }

