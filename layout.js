// layout

function LAYOUT(name, width, height) {	
	this.name = name;
	this.element = null;			// div surrounding all child blocks
	this.width = width;
	this.height = height;
	this.blocks = [];
	
	this.init();	
}


// initialize the layout
LAYOUT.prototype.init = function() {
	
	switch (this.name) {
		case 'login': 
			this.element = $('#login');
			this.blocks.push ( new BLOCK('login', 0, 0, 1, 1) ); 
		break;
		
        case 'lobby': 
			this.element = $('#lobby');
			this.blocks.push( new BLOCK('lobby-games', 0.02, 0.02, 0.7, 0.4) ); 
			this.blocks.push( new BLOCK('lobby-users', 0.75, 0.02, 0.22, 0.95) ); 
			this.blocks.push( new BLOCK('lobby-chat', 0.02, 0.45, 0.7, 0.45) ); 
			this.blocks.push( new BLOCK('lobby-chat-input', 0.02, 0.92, 0.7, 0.05) ); 
		break;
		
		case 'epoch':
			this.element = $('#epoch');
			this.blocks.push( new BLOCK('epoch-game', 0, 0, 0.75, 1) ); 
			this.blocks.push( new BLOCK('epoch-ui', 0.75, 0, 0.25, 1) ); 
			this.blocks.push( new BLOCK('epoch-editor', 0, 0, 0.75, 0.2) );
		break;
    }
	
	this.hide();
}


// resize the layout
LAYOUT.prototype.resize = function(width, height) {
	
	this.width = width;
	this.height = height;
	
	this.element.width(width);
	this.element.height(height);
	
	// resize all blocks
	this.blocks.forEach( function(block) {
		block.resize(width, height);	
	});
}


// hide the layout
LAYOUT.prototype.hide = function() {
	
	this.element.css('visibility', 'hidden');
	this.element.css('top', '-1000px');
	this.element.css('width', '0');
	this.element.css('height', '0');
	
	this.blocks.forEach( function(block) {
		block.hide();
	});	
}


// show the layout
LAYOUT.prototype.show = function() {
	
	this.element.css('visibility', 'visible');
	this.element.css('top', '0');
	this.element.css('width', this.width + 'px');
	this.element.css('height', this.height + 'px');	
	
	this.blocks.forEach( function(block) {
		block.show();
	});
}