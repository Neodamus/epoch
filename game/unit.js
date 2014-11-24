function UNIT(id, tileId, type) {
	
	this.id = id;
	this.tileId = tileId;
	this.type = type;
	
	this.name;
	this.attributes;
	this.abilities;
	
	this.set();	
}


// sets all the necessary data for UNIT from UNITDATA
UNIT.prototype.set = function() {
	
	var unitdata = EOE.game.unitdata[this.type];
	
	this.name = unitdata.name;
	this.attributes = JSON.parse(unitdata.attributes);
	this.abilities = JSON.parse(unitdata.abilities);		
}

// Unitdata has the following structure after being set
// UNITDATA { vanguard: {unit}, nightmare: {unit} }
function UNITDATA() {
	
	// when UNITDATA is created, request the data from the server
	// when data is received, it is sent to set function
	SEND('getUNITDATA');
}


// when UNITDATA is received from server, socket uses set to initialize the data
// @param unitdata -- [ { id, type, name, attributes, abilities } ]
UNITDATA.prototype.set = function(unitdata) {

	var setUnit = function(unit, index) {
		this[unit.type] = unit;	
	}
	unitdata.forEach( setUnit.bind(this) );
	
	getBlock('epoch-editor').setUnitImages();
}