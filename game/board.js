// BOARD handles all user input and display output
function BOARD() {
		
	this.block = getBlock('epoch-game');
	
	// canvases
	this.backgroundCanvas = $('#epoch-game-layer0')[0];
	this.frontCanvas = $('#epoch-game-layer1')[0];
	
	// stage
	this.backgroundStage;		
	this.frontStage;			
		
	
	// dimensions of board in pixels
	this.resolution = { x: 1000, y: 1000 };
	this.width;
	this.height;
	
	// dimensions of board in tiles	-- must be odd
	this.widthTiles = 7;
	this.heightTiles = 13;
			 
	
	// tile variables
	this.tilesContainer; // createjs.Container
	this.stageTiles = []; // Array of bitmaps -- this.frontStage.children[0].children
	this.tiles = [];
	this.hoverTile = null;	// createjs.Bitmap
	this.selectedTile = null;	// (TILE)
	this.selectedStageTile = null; // createjs.Bitmap
	
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
				var x = event.currentTarget.x;
				var y = event.currentTarget.y; 
				this.click( x, y ); 
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


BOARD.prototype.addUnit = function(tileId, type) {	
	
	var tile = this.tiles[tileId];
	var unit = new createjs.Bitmap(EOE.images.getResult(type));
	unit.x = tile.x;
	unit.y = tile.y;
	
	this.tilesContainer.addChild( unit );
	
	tile.unitBitmapIndex = this.stageTiles.length - 1; 
	
	return tile;	
}


BOARD.prototype.moveUnit = function() { }


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
	
	// remove border on every click
	this.frontStage.removeChild(this.selectedStageTile);
	
	// setup variables
	var tileId = this.getTileIdByCoord(x, y);	
	var tile = this.tiles[tileId];	
	this.selectedTile = tile;
	
	// add yellow border
	var selection = new createjs.Bitmap(EOE.images.getResult('borderyellow'));	
	selection.x = tile.x + this.offsetX;
	selection.y = tile.y + this.offsetY;
	this.frontStage.addChild(selection);
	
	// keep track of stageTile thats selected
	this.selectedStageTile = selection;
	
	// tell game a tile was selected
	EOE.game.tileSelect(tile);
}


BOARD.prototype.rightclick = function(x, y) {
	
	var tileId = this.getTileIdByCoord(x, y);
	EOE.game.addUnit(tileId, getBlock('epoch-editor').selectedUnit);
	
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