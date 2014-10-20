// GAME will control all components and handle information between components + server communication

function GAME(mode) {

	this.mode = mode;  // live, test
	
	// components
	this.board = new BOARD();
	this.ui = new UI();	
	
	// update ticker
	var update = function() { this.update(); }
	createjs.Ticker.setFPS(20);
	createjs.Ticker.addEventListener("tick", update.bind(this));	
}


GAME.prototype.resize = function(width, height) {
	this.board.resize(width, height);
}


GAME.prototype.update = function() {
	this.board.update();	
}

