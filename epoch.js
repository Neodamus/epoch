var EOE;
$(document).ready( function() { EOE = new epoch(); EOE.init(); } );

function epoch() {
	
	this.GLOBALS = new globals();
	this.DISPLAY = new display();
	this.SOCKET = new socket();
	
	initEventListeners();		
}

epoch.prototype.init = function() {	
	this.DISPLAY.init();
}
