// TILE is used to interface between BOARD and GAME

function TILE(id) {
	
	this.id = id; 			// @TODO: probably needs to be set by server due to client/server mixup with multi users
	
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