// BOARD handles all user input and display output
function BOARD() {
	
	this.canvas = $('#epoch-game-canvas')[0];
	this.block = getBlock('epoch-game');	
	
	// dimensions of board in pixels
	this.resolution = { x: 1000, y: 1000 };
	this.width;
	this.height;
	
	// dimensions of board in tiles	-- must be odd
	this.widthTiles = 7;
	this.heightTiles = 13;
	
	// stage
	this.stage;
	
	// holds tiles
	this.tiles = [];
	this.currentTile = null;
	this.currentSelection = null;
	
	//initialize
	this.init();
}


BOARD.prototype.init = function() {
	
	// size stage and canvas
	var width = this.block.element.width() * 0.98;
	var height = this.block.element.height() * 0.98;
	
	this.canvas.width = this.resolution.x;
	this.canvas.height = this.resolution.y;
	
	this.stage = new createjs.Stage('epoch-game-canvas');
	this.stage.enableMouseOver();
	
	this.canvas.width = width;
	this.canvas.height = height;
	this.stage.scaleX = width / this.resolution.x;
	this.stage.scaleY = height / this.resolution.y;
	
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	
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
			var getTileId = function(event) {
				var x = event.currentTarget.x;
				var y = event.currentTarget.y; 
				this.mouseover( x, y ); 
			}
			tile.addEventListener('mouseover', getTileId.bind(this));
			
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
			
			tiles.addChild(tile);
			this.tiles[index] = { x: tile.x, y: tile.y };
			
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
	this.offsetX = tiles.x = (this.canvas.width - bounds.width * this.canvas.width / this.resolution.x) / 2;
	this.offsetY = tiles.y = (this.canvas.height - bounds.height * this.canvas.height / this.resolution.y) / 2;
	
	this.stage.addChild(tiles);	
}


BOARD.prototype.getTileIdByCoord = function(x, y) {	

	var id;
	
	for (var i = 0; i < this.tiles.length; i++) {
		if (this.tiles[i].x == x & this.tiles[i].y == y) { id = i; }	
	}
	
	return id;
}


BOARD.prototype.mouseover = function(x, y) {
	
	if (this.currentSelection) { this.stage.removeChild(this.currentSelection); }
	
	this.currentTile = this.getTileIdByCoord(x, y);
	var tile = new createjs.Bitmap(EOE.images.getResult('borderyellow'));
	tile.x = x + this.offsetX;
	tile.y = y + this.offsetY;
	this.currentSelection = tile;
	this.stage.addChild(tile);
	
}


BOARD.prototype.resize = function(width, height) {
	
	this.canvas.width = width * 0.98;
	this.canvas.height = height * 0.98;
	
	var scaleX = width / this.resolution.x;
	var scaleY = height / this.resolution.y;
	this.stage.scaleX = scaleX;
	this.stage.scaleY = scaleY;
	this.stage.update();		
}


BOARD.prototype.update = function() {
	this.stage.update();
}