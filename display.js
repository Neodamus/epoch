// display

function display() {

	this.background = $('#background');			// background div
	this.wrapper = $('#wrapper');				// wrapper div

	this.layouts = [];							// holds all layouts - game, lobby, admin
	this.activeLayout = '';	
	
	window.addEventListener('resize', this.resize.bind(this), false);
	this.resize();
	
	this.width = this.wrapper.width();
	this.height = this.wrapper.height();
}


// inititalizes display object
display.prototype.init = function() {
	
	var LAYOUTS = this.layouts;
	
	var width = this.width
	var height = this.height;	
	
	// gather all layouts
	var layouts = [ 'login' ];
	layouts.forEach( function(name) {
		LAYOUTS.push( new layout(name, width, height) );
	});
	
	// choose activelayout
	
}

	
// turns off active layout, displays new layout
display.prototype.changeLayout = function(layout) { 		
	this.activeLayout.hide();
	this.activeLayout = layout;
	layout.show();
};
	 			
	
// resizes display, then resizes layout
display.prototype.resize = function() {  
	
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



