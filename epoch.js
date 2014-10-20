var EOE;
$(document).ready( function() { EOE = new epoch(); EOE.init(); } );

function epoch() {
	
	this.display = new DISPLAY();
	this.socket = new SOCKET();
	
	this.images_loader = new IMAGES_LOADER();	
	this.images = null;	// will store all images
	
	this.game;	
	
	this.username = '';		
}

epoch.prototype.init = function() {	
	this.display.init();
	this.images_loader.loadAssets();
}
