function TILE(x, y, stageIndex) {
	
	this.x = x;
	this.y = y;
	this.stageIndex;	// will be used when tiles are containers
	
	this.unitBitmapIndex;	// if tile has a unit, this is index of unit bitmap in tilesContainer
	
	this.unit; 	// contains a unit if there is 1
	
}

/*
TILE.prototype.setUnitPosition = function(x, y) {
	
	if (this.unit) {
		this.unit.x = this.x;
		this.unit.y = this.y;
	} else {
		console.log('You are trying to setUnitPosition for a tile that doesn\'t have a unit');
	}
}
*/