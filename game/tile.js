// TILE is used to interface between BOARD and GAME

function TILE(id) {
	
	this.id = id;
	
	// set by game/server
	this.x;
	this.y;
	this.unit;
	this.neighbors;			// not currently used but maybe could be used in the future for something
	this.type;		 		// set by server with a selectTileResponse -- 'select', 'move', 'attack', 'ability'
	
	// set by board
	this.boardX;
	this.boardY;
	this.unitBitmapIndex;	// if tile has a unit, this is index of unit bitmap in board.unitBitmaps
	
}