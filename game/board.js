// BOARD handles all user input and display output
function BOARD() {
		
	this.block = getBlock('epoch-game');
	
	// canvases
	this.backgroundCanvas = $('#epoch-game-layer0')[0];
	this.frontCanvas = $('#epoch-game-layer1')[0];
	
	// stage
	this.backgroundStage;		
	this.frontStage;		
	
	// mousemode -- used to determine what left and right click actions will be used
	this.mousemode = 'create';
	
	// dimensions of board in pixels
	this.resolution = { x: 1000, y: 1000 };
	this.width;
	this.height;
	
	// dimensions of board in tiles	-- must be odd
	this.widthTiles = 7;
	this.heightTiles = 13;			 
	
	// tile variables
	this.tileWidth = 70; // int -- width of a tile in pixels
	this.tileHeight = 82; // int -- height of a tile in pixels
	this.tilesContainer; // createjs.Container
	this.stageTiles = []; // Array of bitmaps -- this.frontStage.children[0].children
	this.tiles = [];
	this.hoverTile = null;	// createjs.Bitmap
	this.selectedTile = null;	// TILE
	this.selectedStageTile = null; // createjs.Bitmap
	this.moveTiles = []; // [TILE]
	this.moveTilesContainer = null; // createjs.Container
	
	//initialize
	this.init();
}


BOARD.prototype.init = function() {
	
	// disable right click
	$('body').on('contextmenu', '#epoch-game-layer1', function(e){ return false; });
	
	// size stage and canvas
	var width = this.block.element.width() * 0.98;
	var height = this.block.element.height() * 0.98;
	
	// set all canvases to resolution for game -- needs to be set before added to stage
	this.backgroundCanvas.width = this.frontCanvas.width = this.resolution.x;
	this.backgroundCanvas.height = this.frontCanvas.height = this.resolution.y;
	
	// setup stages
	this.backgroundStage = new createjs.Stage('epoch-game-layer0');
	this.frontStage = new createjs.Stage('epoch-game-layer1');
	
	// enable mouseover functionality
	this.frontStage.enableMouseOver(30);
	
	// size canvases to appropriate size within block
	this.backgroundCanvas.width = this.frontCanvas.width = width;
	this.backgroundCanvas.height = this.frontCanvas.height = height;
	this.backgroundStage.scaleX = this.frontStage.scaleX = width / this.resolution.x;
	this.backgroundStage.scaleY = this.frontStage.scaleY = height / this.resolution.y;
	
	this.width = this.backgroundCanvas.width;
	this.height = this.backgroundCanvas.height;
	
	// initialize all board tiles	
	var tiles = new createjs.Container();
	for (var row = 0; row < this.heightTiles; row++) {
		
		var cols = 0; 
		
		if (row < this.heightTiles / 2) {
			cols = this.widthTiles + row;
		} else {
			cols = this.widthTiles + this.heightTiles - row - 1;
		}
		
		for (var col = 0; col < cols; col++) {
			
			var index = this.tiles.length;
			
			// tile setup
			var tile = new createjs.Bitmap(EOE.images.getResult('newgrass'));
			var bounds = tile.getBounds();
			tile.filters = [ new createjs.ColorFilter(1,1,1,1, 10, 40, 10, 0) ];
			tile.cache(0, 0, bounds.width, bounds.height);
			tile.index = index;
			
			// event listeners for tile
			var mouseover = function(event) {
				var x = event.currentTarget.x;
				var y = event.currentTarget.y; 
				this.mouseover( x, y ); 
			}
			tile.addEventListener('mouseover', mouseover.bind(this));
			
			var mouseout = function(event) {
				var x = event.currentTarget.x;
				var y = event.currentTarget.y; 
				this.mouseout( x, y ); 
			}
			tile.addEventListener('mouseout', mouseout.bind(this));
			
			var click = function(event) {					
				if ( event.nativeEvent.button == 0 ) {
					var x = event.currentTarget.x;
					var y = event.currentTarget.y; 
					this.click( x, y );				
				}  
			}
			tile.addEventListener('click', click.bind(this));
			
			var rightclick = function(event) {		
				if ( event.nativeEvent.button == 2 ) {
					var x = event.currentTarget.x;
					var y = event.currentTarget.y; 
					this.rightclick( x, y ); 					
				} 
			}
			tile.addEventListener('mousedown', rightclick.bind(this));
			
			
			// set position of tile
			var offset = bounds.width * Math.floor(this.widthTiles / 2);
			if (row < this.heightTiles / 2) {
				if (row % 2 == 0) {
					
					tile.x = col * bounds.width - row * (bounds.width / 2) + offset;
					tile.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2);
					
					
				} else {
					
					tile.x = col * bounds.width - row * (bounds.width / 2) + offset;
					tile.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2) + bounds.height * 3 / 4;				
									
				}
			} else {
				
				if (row % 2 == 0) {
					
					tile.x = col * bounds.width - (this.heightTiles - row - 1) * (bounds.width / 2) + offset;
					tile.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2);
					
					
				} else {
					
					tile.x = col * bounds.width - (this.heightTiles - row - 1) * (bounds.width / 2) + offset;
					tile.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2) + bounds.height * 3 / 4;				
									
				}
				
			}
			
			// add tile image to stage, create TILE class to interface with it, then add new tile to this.tiles
			tiles.addChild(tile);
			var stageIndex = tiles.children.length - 1;
			this.tiles[index] = new TILE(tile.x, tile.y, stageIndex);
			
			// show numbers
			var showNumbers = false;
			if (showNumbers) {
			var text = new createjs.Text(index, "20px Arial", "#fff");
				text.x = tile.x + (bounds.width - text.getMeasuredWidth()) / 2;
				text.y = tile.y + (bounds.height - text.getMeasuredHeight()) / 2;
				tiles.addChild(text);
			}
		}
	}
	
			
	bounds = tiles.getBounds();
	this.offsetX = tiles.x = (this.backgroundCanvas.width - bounds.width * this.backgroundCanvas.width / this.resolution.x) / 2;
	this.offsetY = tiles.y = (this.backgroundCanvas.height - bounds.height * this.backgroundCanvas.height / this.resolution.y) / 2;
	this.backgroundStage.addChild(tiles);
	
	// cache tiles and add to background
	this.backgroundStage.cache(tiles.x, tiles.y, bounds.width, bounds.height);
	this.backgroundStage.update();
	
	// make tiles invisible and add to frontStage
	this.frontStage.addChild(tiles);
	tiles.children.forEach( function (tile) {	
		tile.alpha = 0.01;		
	});
	
	// quick references
	this.tilesContainer = this.frontStage.children[0];
	this.stageTiles = this.tilesContainer.children;	
}


// @param tile -- TILE class
BOARD.prototype.selectTile = function(tile) {
	
	// remove border on every click
	this.frontStage.removeChild(this.selectedStageTile);
		
	// add yellow border
	var selection = new createjs.Bitmap(EOE.images.getResult('borderyellow'));	
	selection.x = tile.x + this.offsetX;
	selection.y = tile.y + this.offsetY;
	this.frontStage.addChild(selection);
	
	// set selectedTile for board	
	this.selectedTile = tile;
	
	// keep track of stageTile thats selected
	this.selectedStageTile = selection;
	
	// tell game a tile was selected
	EOE.game.selectTile(tile);
	
}


BOARD.prototype.addUnit = function(tileId, type) {	
	
	var tile = this.tiles[tileId];
	var unit = new createjs.Bitmap(EOE.images.getResult(type));
	unit.x = tile.x;
	unit.y = tile.y;
	
	this.tilesContainer.addChild( unit );
	
	tile.unitBitmapIndex = this.stageTiles.length - 1; 
	
	return tile;	
}


// moves a unit to destination
BOARD.prototype.moveUnitRequest = function(unit, destinationTileId) {
	
	// send move coordinates to game queue
	EOE.game.moveUnitRequest(unit, destinationTileId);
}

BOARD.prototype.moveUnitResponse = function(unitId, destinationTileId) {
	
	// setup tiles
	var unit = EOE.game.units[unitId];
	var sourceTile = this.tiles[unit.tileId];
	var destinationTile = this.tiles[destinationTileId];
	
	if (this.moveTiles.indexOf(destinationTile) != -1) {
		
		// change units tile id
		unit.tileId = destinationTileId;
		
		// move image
		var image = this.tilesContainer.children[sourceTile.unitBitmapIndex];
		image.x = destinationTile.x;
		image.y = destinationTile.y;
		
		// update tiles
		destinationTile.unitBitmapIndex = sourceTile.unitBitmapIndex;
		destinationTile.unit = sourceTile.unit;
		sourceTile.unitBitmapIndex = null;
		sourceTile.unit = null;
		
		this.selectTile(destinationTile);
	}
}


BOARD.prototype.removeUnit = function(tileId) { 
	
	var unitBitmapIndex = this.tiles[tileId].unitBitmapIndex;	
	this.tilesContainer.getChildAt(unitBitmapIndex).visible = false;	
}


BOARD.prototype.getTileIdByCoord = function(x, y) {	

	var id;
	
	for (var i = 0; i < this.tiles.length; i++) {
		if (this.tiles[i].x == x & this.tiles[i].y == y) { id = i; }	
	}
	
	return id;
}


// shows move tiles on the board for the unit
BOARD.prototype.setMoveTiles = function(unit) {
	
	if (this.moveTilesContainer) { this.frontStage.removeChild(this.moveTilesContainer); }
	
	// get all movable tiles
	var speed = unit.attributes.speed - 2;	
	var moveTiles = this.getTiles(this.selectedTile, 'radius', speed);
	
	// remove any tiles with units
	moveTiles.forEach( function(tile, index, array) {
		if (tile.unit) { array.splice(index, 1) }
	});
	
	// set moveTiles to board
	this.moveTiles = moveTiles;
		
	var moveTilesContainer = new createjs.Container();
	
	for (var i = 0; i < moveTiles.length; i++) {	
		var tile = 	moveTiles[i];	
		var moveborder = new createjs.Bitmap(EOE.images.getResult('border-move'));	
		moveborder.x = tile.x + this.offsetX;
		moveborder.y = tile.y + this.offsetY;
		moveTilesContainer.addChild(moveborder);
	}
		
	this.frontStage.addChild(moveTilesContainer);
	this.moveTilesContainer = moveTilesContainer;
}


// returns an array of TILEs based on parameters
// @param tile - (TILE) origin tile
// @param mode - (String) 'radius', 'line', 'cone', 'ring'
// @param settings - (int || String || Object) 
BOARD.prototype.getTiles = function(tile, mode, settings) {
	
	var tiles = [];
	
	switch (mode) {
		
		// @param settings - (int > 0)
		case 'radius':
		
			//add origin tile
			//tiles.push(tile);
			
			// add tiles around origin		
				
			var tempX, tempY, tempId, tempTile;
			
			// top left column
			for (var length = settings; length > 0; length--) {
				
				tempX = tile.x - length * (this.tileWidth * 0.5);
				tempY = tile.y - length * (this.tileHeight * 0.75);
				tempId = this.getTileIdByCoord(tempX, tempY);
				if (tempId) {
					tempTile = this.tiles[tempId];
					tiles.push(tempTile);
				}
				
				// trailing tiles
				for (var trail = length - 1; trail > 0; trail--) {
				
					trailX = tempX + trail * this.tileWidth;
					trailY = tempY;
					tempId = this.getTileIdByCoord(trailX, trailY);
					if (tempId) {
						tempTile = this.tiles[tempId];
						tiles.push(tempTile);
					}						
				
				}
			}
			
			// top right column
			for (var length = settings; length > 0; length--) {
				
				tempX = tile.x + length * (this.tileWidth * 0.5);
				tempY = tile.y - length * (this.tileHeight * 0.75);
				tempId = this.getTileIdByCoord(tempX, tempY);
				if (tempId) {
					tempTile = this.tiles[tempId];
					tiles.push(tempTile);
				}
				
				// trailing tiles
				for (var trail = length - 1; trail > 0; trail--) {
				
					trailX = tempX + trail * this.tileWidth * 0.5;
					trailY = tempY + trail * this.tileHeight * 0.75;
					tempId = this.getTileIdByCoord(trailX, trailY);
					if (tempId) {
						tempTile = this.tiles[tempId];
						tiles.push(tempTile);
					}						
				
				}
			}				
			
			// right column
			for (var length = settings; length > 0; length--) {
				
				tempX = tile.x + length * this.tileWidth;
				tempY = tile.y;
				tempId = this.getTileIdByCoord(tempX, tempY);
				if (tempId) {
					tempTile = this.tiles[tempId];
					tiles.push(tempTile);
				}
				
				// trailing tiles
				for (var trail = length - 1; trail > 0; trail--) {
				
					trailX = tempX - trail * this.tileWidth * 0.5;
					trailY = tempY + trail * this.tileHeight * 0.75;
					tempId = this.getTileIdByCoord(trailX, trailY);
					if (tempId) {
						tempTile = this.tiles[tempId];
						tiles.push(tempTile);
					}						
				
				}
			}			
			
			// bottom right column
			for (var length = settings; length > 0; length--) {
				
				tempX = tile.x + length * this.tileWidth * 0.5;
				tempY = tile.y + length * this.tileHeight * 0.75;
				tempId = this.getTileIdByCoord(tempX, tempY);
				if (tempId) {
					tempTile = this.tiles[tempId];
					tiles.push(tempTile);
				}
				
				// trailing tiles
				for (var trail = length - 1; trail > 0; trail--) {
				
					trailX = tempX - trail * this.tileWidth;
					trailY = tempY;
					tempId = this.getTileIdByCoord(trailX, trailY);
					if (tempId) {
						tempTile = this.tiles[tempId];
						tiles.push(tempTile);
					}						
				
				}
			}			
			
			// bottom left column
			for (var length = settings; length > 0; length--) {
				
				tempX = tile.x - length * this.tileWidth * 0.5;
				tempY = tile.y + length * this.tileHeight * 0.75;
				tempId = this.getTileIdByCoord(tempX, tempY);
				if (tempId) {
					tempTile = this.tiles[tempId];
					tiles.push(tempTile);
				}
				
				// trailing tiles
				for (var trail = length - 1; trail > 0; trail--) {
				
					trailX = tempX - trail * this.tileWidth * 0.5;
					trailY = tempY - trail * this.tileHeight * 0.75;
					tempId = this.getTileIdByCoord(trailX, trailY);
					if (tempId) {
						tempTile = this.tiles[tempId];
						tiles.push(tempTile);
					}						
				
				}
			}			
			
			// left column
			for (var length = settings; length > 0; length--) {
				
				tempX = tile.x - length * this.tileWidth;
				tempY = tile.y;
				tempId = this.getTileIdByCoord(tempX, tempY);
				if (tempId) {
					tempTile = this.tiles[tempId];
					tiles.push(tempTile);
				}
				
				// trailing tiles
				for (var trail = length - 1; trail > 0; trail--) {
				
					trailX = tempX + trail * this.tileWidth * 0.5;
					trailY = tempY - trail * this.tileHeight * 0.75;
					tempId = this.getTileIdByCoord(trailX, trailY);
					if (tempId) {
						tempTile = this.tiles[tempId];
						tiles.push(tempTile);
					}						
				
				}
			}
		
		break;		
	}
	
	return tiles;	
}



BOARD.prototype.mouseover = function(x, y) {
	
	var tileId = this.getTileIdByCoord(x, y);	
	
	var currentTile = this.tiles[tileId];	
	
	if (currentTile) {
		var hover = new createjs.Bitmap(EOE.images.getResult('newgrass'));	
		hover.x = currentTile.x + this.offsetX;
		hover.y = currentTile.y + this.offsetY;
		var bounds = hover.getBounds();
		hover.filters = [ new createjs.ColorFilter(1, 1, 1, 1, 255, 255, 255, -200) ];
		hover.cache( 0, 0, bounds.width, bounds.height );	
		this.hoverTile = hover;
		this.frontStage.addChild(hover);	
	}	
}



BOARD.prototype.mouseout = function(x, y) {
	
	// performance could be improved here possibly by referencing index 'removeChildAt'
	if (this.hoverTile) { this.frontStage.removeChild(this.hoverTile); }
}


BOARD.prototype.click = function(x, y) {
	
	// setup variables
	var tileId = this.getTileIdByCoord(x, y);	
	var tile = this.tiles[tileId];	
	
	if (this.mousemode == 'create') {
		
		//this.selectTile(tile);
		var unit = getBlock('epoch-editor').selectedUnit;
		unit != '' ? EOE.game.addUnitRequest(tileId, unit) : false;		
		
	} else if (this.mousemode == 'game') {
		this.selectTile(tile);
	}
}


BOARD.prototype.rightclick = function(x, y) {
	
	var tileId = this.getTileIdByCoord(x, y);
	var tile = this.tiles[tileId];
	
	if (this.mousemode == 'create') {
		EOE.game.addUnit(tileId, getBlock('epoch-editor').selectedUnit);
	} else if (this.mousemode == 'game') {
		var unit = EOE.game.selectedUnit;
		if (unit) {
			this.moveUnitRequest(unit, tileId);	
		}
	}
	
}


BOARD.prototype.resize = function(width, height) {
	
	this.backgroundCanvas.width = this.frontCanvas.width = this.width = width * 0.98;
	this.backgroundCanvas.height = this.frontCanvas.height = this.height = height * 0.98;
	
	var scaleX = width / this.resolution.x;
	var scaleY = height / this.resolution.y;
	this.backgroundStage.scaleX = this.frontStage.scaleX = scaleX;
	this.backgroundStage.scaleY = this.frontStage.scaleY = scaleY;
	
	this.backgroundStage.update();
	this.frontStage.update();
}


BOARD.prototype.update = function() {
	this.frontStage.update();
}