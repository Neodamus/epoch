// block

function block(name, x, y, width, height) {
	this.name = name;
	this.child = null;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height; 
	
	this.init();	
}


// initialize the block
block.prototype.init = function() {
	
	var child;
	
	switch (this.name) {
		case 'login': this.child = $('#login'); 
			$('#loginButton').on('click', function() { SEND('login', $('#loginName').val()) });
		break;	
	}
	
	this.child.width(this.width);
	this.child.height(this.height);
	this.child.css('visibility', 'visible');
	
}


// resize the layout
block.prototype.resize = function(width, height) {
	
	this.width = width;
	this.height = height;
	
	this.child.width(width);
	this.child.height(height);
		
}


block.prototype.move = function(x, y) {
	this.x = x;
	this.y = y;	
}