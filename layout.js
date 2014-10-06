// layout

function layout(name, width, height) {	
	this.name = name;
	this.width = width;
	this.height = height;
	this.blocks = [];
	
	this.init();	
}


// initialize the layout
layout.prototype.init = function() {
	
	var w = this.width;
	var h = this.height;
	var BLOCK;
	
	switch (this.name) {
		case 'login': BLOCK = new block('login', 0, 0, w, h); break;	
	}
	
	this.blocks.push(BLOCK);
}


// resize the layout
layout.prototype.resize = function(width, height) {
	
	this.width = width;
	this.height = height;
	
	// resize all blocks
	this.blocks.forEach( function(block) {
		block.resize(width, height);	
	});
}