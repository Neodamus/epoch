// display

function DISPLAY() {

	this.background = $('#background');			// background div
	this.wrapper = $('#wrapper');				// wrapper div

	this.layouts = [];							// holds all layouts - game, lobby, admin
	this.activeLayout = null;					// layout object
	
	window.addEventListener('resize', this.resize.bind(this), false);
	this.resize();
	
	this.width = this.wrapper.width();
	this.height = this.wrapper.height();
}


// inititalizes display object
DISPLAY.prototype.init = function() {
	
	var layouts = this.layouts;
	
	var width = this.width;
	var height = this.height;	
	
	// gather all layouts
	var layoutNames = [ 'login', 'lobby', 'epoch' ];
	layoutNames.forEach( function(name) {
		var layout = new LAYOUT(name, width, height);
		layout.resize(width, height);
		layouts.push(layout);
	});
	
	// choose activelayout
	if (localStorage.EOE_username) {
		this.activeLayout = layouts[0];
	} else {
		this.activeLayout = layouts[0];	
	}
	
	this.activeLayout.show();
	
	// open test mode
	$(document.body).keypress( function(e) {
		var key = e.which;
		if (key == 92) { EOE.display.changeLayout('epoch'); getBlock('epoch-unit-editor').hide(); EOE.game = new GAME(); getBlock('epoch-game').game = EOE.game; }
	});
}

	
// turns off active layout, displays new layout
DISPLAY.prototype.changeLayout = function(name) { 
	var activeLayout = this.activeLayout;		
	activeLayout.hide();
	this.layouts.forEach( function(layout) {
		if (layout.name == name) { activeLayout = layout; }
	});
	this.activeLayout = activeLayout;
	this.activeLayout.show();
};
	 			
	
// resizes display, then resizes layout
DISPLAY.prototype.resize = function() {  
	
	var width = this.background.width();
	var height = this.background.height();
	
	var r = this.aspect = { x: 4, y: 3 }; //aspect ratio to maintain (background image size)
	
	//get maximum screen size
	var max = { x: this.background.width(), y: this.background.height() };
	
	//figure out maximum resolution while maintaining aspect ratio	
	//limiting factor is height->adjust width
    if ((max.x / r.x) * r.y > max.y) { 
		max.x = (max.y / r.y) * r.x;
	} else { //limiting factor is width->adjust height
		max.y = (max.x / r.x) * r.y; 
	} 
	
	//adjust wrapper
	this.wrapper.css("width", max.x);
	this.wrapper.css("height", max.y);

	//adjust stage stretch and shrink appropriately
	/*
	var rx = background.canvas.width / scaleFrom.x;
	var ry = background.canvas.height / scaleFrom.y;
	
	background.scaleX = rx;
	background.scaleY = ry;
	stage.scaleX = rx;
	stage.scaleY = ry;
	
	background.update();
	stage.update();
	*/

	// resize all layouts
	this.layouts.forEach( function(layout) {
		layout.resize(max.x, max.y);
	});
};	



