// BOARD handles user input and display output for canvas elements

function BOARD(game) {
	
	// needs reference to game to send user input
	this.game = game;
	
	// canvases
	this.backgroundCanvas = $('#epoch-game-layer0')[0];
	this.frontCanvas = $('#epoch-game-layer1')[0];
	
	// stages
	this.backgroundStage;		
	this.frontStage;			
	
	// dimensions of board in pixels
	this.resolution = { x: 1000, y: 1000 };
	this.width;
	this.height;		 
	
	// tile dimensions
	this.tileWidth = 70; 						// width of tile in pixels
	this.tileHeight = 82; 						// height of tile in pixels
	
	this.imageScale = 0.8;	
	this.imagePaddingLeft = this.tileWidth * 0.1; 
	this.imagePaddingTop = this.tileHeight * 0.1;
	
	// createjs variables
	this.tileBitmapsContainer;					// createjs.Container -- contains all the createjs.Bitmap elements for interactive tiles
	this.tileBitmaps; 							// [ createjs.Bitmap ] -- equal to this.tileBitmapsContainer.children;	
	
	this.unitBitmapsContainer;					// createjs.Container -- contains all the createjs.Bitmap elements for units
	this.unitBitmaps;							// [ createjs.Bitmap ] -- equal to this.unitBitmapsContainer.children;
	
	this.placementTileBitmapsContainer = null;	// createjs.Container -- contains all the createjs.Bitmap elements for placement tiles
	this.activeTileBitmapsContainer = null;		// createjs.Container -- contains all the createjs.Bitmap elements for active tiles
	
	this.hoverTile;								// createjs.Bitmap
	
	//
	this.init();
}


BOARD.prototype.init = function() {
	
	// disable right click
	$('body').on('contextmenu', '#epoch-game-layer1', function(e){ return false; });
	
	// size stage and canvas
	var width = getBlock('epoch-game').element.width() * 0.98;
	var height = getBlock('epoch-game').element.height() * 0.98;
	
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
	
	// setup unit bitmaps container and add to front stage
	this.unitBitmapsContainer = new createjs.Container();
	this.unitBitmaps = this.unitBitmapsContainer.children;
	this.frontStage.addChild(this.unitBitmapsContainer);	
}


// sets up initial board properties for tiles, giving easy communication with game
BOARD.prototype.initTiles = function() {
	
	// game variables
	var tiles = this.game.tiles;
	var widthTiles = this.game.widthTiles;
	var heightTiles = this.game.heightTiles;
		
	// setup container to put tile bitmaps into
	var boardTiles = new createjs.Container();
	
	for (var i = 0; i < tiles.length; i++) {
		
		// TILE TO BE INITIALIZED
		var tile = this.game.tiles[i];			
				
		// CREATE TILE BITMAP
		var tileBitmap = new createjs.Bitmap(EOE.images.getResult('newgrass'));
		var bounds = tileBitmap.getBounds();
		tileBitmap.filters = [ new createjs.ColorFilter(1,1,1,1, 10, 40, 10, 0) ];
		tileBitmap.cache(0, 0, bounds.width, bounds.height);				
			
		// EVENT LISTENERS
		var mouseover = function(event) {
			var x = event.currentTarget.x;
			var y = event.currentTarget.y; 
			this.mouseover( x, y ); 
		}
		tileBitmap.addEventListener('mouseover', mouseover.bind(this));
			
		var mouseout = function(event) {
			var x = event.currentTarget.x;
			var y = event.currentTarget.y; 
			this.mouseout( x, y ); 
		}
		tileBitmap.addEventListener('mouseout', mouseout.bind(this));
		
		var click = function(event) {					
			if ( event.nativeEvent.button == 0 ) {
				var x = event.currentTarget.x;
				var y = event.currentTarget.y; 
				this.click( x, y );				
			}  
		}
		tileBitmap.addEventListener('click', click.bind(this));
		
		var rightclick = function(event) {		
			if ( event.nativeEvent.button == 2 ) {
				var x = event.currentTarget.x;
				var y = event.currentTarget.y; 
				this.rightclick( x, y ); 					
			} 
		}
		tileBitmap.addEventListener('mousedown', rightclick.bind(this));					
		
		// SET BOARDX, BOARDY FOR TILE BITMAP BASED ON TILE X, Y		
		var offset = bounds.width * Math.floor(widthTiles / 2);
		var row = tile.y;
		var col = tile.x;
		
		if (row < heightTiles / 2) {
			if (row % 2 == 0) {
				
				tileBitmap.x = col * bounds.width - row * (bounds.width / 2) + offset;
				tileBitmap.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2);
				
				
			} else {
				
				tileBitmap.x = col * bounds.width - row * (bounds.width / 2) + offset;
				tileBitmap.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2) + bounds.height * 3 / 4;				
								
			}
		} else {
			
			if (row % 2 == 0) {
				
				tileBitmap.x = col * bounds.width - (heightTiles - row - 1) * (bounds.width / 2) + offset;
				tileBitmap.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2);
				
				
			} else {
				
				tileBitmap.x = col * bounds.width - (heightTiles - row - 1) * (bounds.width / 2) + offset;
				tileBitmap.y = Math.floor(row * 0.5) * (bounds.height * 3 / 2) + bounds.height * 3 / 4;				
								
			}
			
		}
			
		// ADD BITMAP TO BOARDTILES CONTAINER
		boardTiles.addChild(tileBitmap);
		
		// ADD BOARDTILE COORDINATES TO GAME TILES
		tile.boardX = tileBitmap.x;
		tile.boardY = tileBitmap.y;	
		
		// SHOW NUMBERS
		var showNumbers = false;
		if (showNumbers) {
		var text = new createjs.Text(i, "20px Arial", "#fff");
			text.x = tile.boardX + (bounds.width - text.getMeasuredWidth()) / 2;
			text.y = tile.boardY + (bounds.height - text.getMeasuredHeight()) / 2;
			boardTiles.addChild(text);
		}
		
	}	
	
	// OFFSET BOARDTILES CONTAINER AND ADD TO STAGE		
	bounds = boardTiles.getBounds();
	this.offsetX = boardTiles.x = (this.backgroundCanvas.width - bounds.width * this.backgroundCanvas.width / this.resolution.x) / 2;
	this.offsetY = boardTiles.y = (this.backgroundCanvas.height - bounds.height * this.backgroundCanvas.height / this.resolution.y) / 2;
	this.backgroundStage.addChild(boardTiles);
	
	// CACHE TILES TO BACKGROUND -- NEVER TO BE TOUCHED AGAIN
	this.backgroundStage.cache(boardTiles.x, boardTiles.y, bounds.width, bounds.height);
	this.backgroundStage.update();
	
	// MAKE BOARDTILES INVISIBLE AND ADD TO FRONT STAGE TO ALLOW FOR USER INPUT
	this.frontStage.addChild(boardTiles);
	boardTiles.children.forEach( function (tile) {	
		tile.alpha = 0.01;		
	});
	
	// SETUP QUICK REFERENCES
	this.tileBitmapsContainer = this.frontStage.children[0];
	this.tileBitmaps = this.tileBitmapsContainer.children;	
	
}


// @param tile -- (TILE)
// @param type -- 'vanguard', 'firebringer', etc.
BOARD.prototype.addUnitBitmap = function(tile, type) {
	
	var unitBitmap = new createjs.Bitmap(EOE.images.getResult(type));
	unitBitmap.x = tile.boardX + this.offsetX + this.imagePaddingLeft;
	unitBitmap.y = tile.boardY + this.offsetY + this.imagePaddingTop;
	unitBitmap.scaleX = this.imageScale;
	unitBitmap.scaleY = this.imageScale;
	
	this.unitBitmapsContainer.addChild( unitBitmap );
	
	// add index of unit bitmap in its container to the tile the unit is in
	tile.unitBitmapIndex = this.unitBitmaps.length - 1;		
}


//
BOARD.prototype.removeUnitBitmaps = function() {
	
	// remove unit bitmaps if there are any
	if (this.unitBitmapsContainer) { this.unitBitmapsContainer.removeAllChildren(); }		
}


// @param activeTiles --  ( [ { tileId, tileType } ] ) holds all the tiles that are active and what kind of tile they should be -- move, attack, etc
BOARD.prototype.setActiveTileBitmaps = function(activeTiles) {
	
	var tiles = this.game.tiles;	
	var activeTileBitmapsContainer = new createjs.Container();
	
	for (var i = 0; i < activeTiles.length; i++) {
		
		// active tile variables	
		var tileData = 	activeTiles[i];	
		var tileId = tileData.tileId;
		var tileType = tileData.tileType;
		
		// bitmap setup
		var tile = tiles[tileId];
		var imageName = 'tiletype-' + tileType;
		var border = new createjs.Bitmap(EOE.images.getResult(imageName));
		border.x = tile.boardX + this.offsetX;
		border.y = tile.boardY + this.offsetY;
		
		// add bitmap to container
		activeTileBitmapsContainer.addChild(border);
	}
	
	// add to board and add active tile bitmaps or placement tiles to stage
	var phase = this.game.phase;
	if (phase == 'placement' && activeTileBitmapsContainer.children.length > 1) {
		this.placementTileBitmapsContainer = activeTileBitmapsContainer;
		this.frontStage.addChild(this.placementTileBitmapsContainer);			
	} else if (phase == 'combat' || activeTileBitmapsContainer.children.length == 1) {
		this.activeTileBitmapsContainer = activeTileBitmapsContainer;
		this.frontStage.addChild(this.activeTileBitmapsContainer);		
	}
}


//
BOARD.prototype.removeActiveTileBitmaps = function() {
	
	// remove placement tiles if any
	if (this.game.phase == 'combat') { this.frontStage.removeChild(this.placementTileBitmapsContainer); }
	
	// remove active tiles if there are any
	if (this.activeTileBitmapsContainer) { this.frontStage.removeChild(this.activeTileBitmapsContainer); }			
}


//
BOARD.prototype.loadGamestate = function() {
	
	// remove all previous bitmaps that are no longer necessary
	this.removeUnitBitmaps();

	// get reference to tiles
	var tiles = this.game.tiles;
	
	// go through each tile and determine if theres a unit, etc to add there	
	for (var i = 0; i < tiles.length; i++) {
		
		var tile = tiles[i];
		var unit = tile.unit;
		
		if (unit) {	
			if (unit.alive) {		
				var type = unit.type;
				this.addUnitBitmap(tile, type);	
			}
		}		
	}
}


/* THIS MAY BE UNNECESSARY SINCE IT MOVES BITMAPS AROUND -- NEW WAY JUST RELOADS ALL BITMAPS BASED ON LOADED GAMESTATE
BOARD.prototype.moveUnitResponse = function(unitId, destinationTileId) {
	
	// check to see if unit should be moved by checking active tiles	
	for (var activeTileIndex = 0; activeTileIndex < this.activeTiles.length; activeTileIndex++) {
		
		var activeTile = this.activeTiles[activeTileIndex];
		var activeTileId = activeTile.tileId;
		var activeTileType = activeTile.tileType;
		
		if (activeTileId == destinationTileId && activeTileType == 'move') {
		
			// setup tiles
			var unit = EOE.game.units[unitId];
			var sourceTile = this.tiles[unit.tileId];
			var destinationTile = this.tiles[destinationTileId];
		
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
			
			this.selectTileRequest(destinationTile);	
			
		}
			
	}
	
}
*/


// @TODO make x, y into tileId to prevent dual for-loop searches
BOARD.prototype.mouseover = function(x, y) {
	
	var tile = this.game.getTileByCoord(x, y);		
	
	if (tile) {
		var hover = new createjs.Bitmap(EOE.images.getResult('newgrass'));	
		hover.x = tile.boardX + this.offsetX;
		hover.y = tile.boardY + this.offsetY;
		var bounds = hover.getBounds();
		hover.filters = [ new createjs.ColorFilter(1, 1, 1, 1, 255, 255, 255, -200) ];
		hover.cache( 0, 0, bounds.width, bounds.height );	
		this.hoverTile = hover;
		this.frontStage.addChild(hover);	
	}		
}


//
BOARD.prototype.mouseout = function(x, y) {
	
	// performance could be improved here possibly by referencing index 'removeChildAt'
	if (this.hoverTile) { this.frontStage.removeChild(this.hoverTile); }
}


//
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


//
BOARD.prototype.click = function(x, y) { this.game.click(x, y); }


//
BOARD.prototype.rightclick = function(x, y) { this.game.rightclick(x, y); }


//
BOARD.prototype.update = function() { this.frontStage.update(); }