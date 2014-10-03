// display

function display() {

	this.background = $('#background');			// background div
	this.wrapper = $('#wrapper');				// wrapper div
	
	window.addEventListener('resize', this.resize.bind(this), false);

	this.layouts;								// holds all layouts - game, lobby, admin
	this.activeLayout;							
	
}

	
// turns off active layout, displays new layout
display.prototype.changeLayout = function(layout) { 		
	this.activeLayout.hide();
	this.activeLayout = layout;
	layout.show();
};
	 			
	
// resizes display, then resizes layout
display.prototype.resize = function() {  

	// resize background and wrapper here
	
	var r = this.aspectRatio = { x: 1224, y: 870 }; //aspect ratio to maintain (background image size)
	//might want to move aspectRatio somewhere else?
	
	//get maximum screen size
	var max = { x: this.background.width(), y: this.background.height() };
	
	//figure out maximum resolution while maintaining aspect ratio
    if ((max.x / r.x) * r.y > max.y) { max.x = (max.y / r.y) * r.x; } //limiting factor is height->adjust width
	else { max.y = (max.x / r.x) * r.y; } //limiting factor is width->adjust height
	
	//adjust background and wrapper

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
	//this.layout.resize();
};	



