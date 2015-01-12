function UNIT(id, tileId, type, army) {
	
	this.id = id;
	this.tileId = tileId;
	this.type = type;
	this.army = army;
	
	// set by id -- should never change
	this.name;
	this.attributes;
	this.abilities;
	
	// all game-time stats are added as properties to the unit in set function
	
	// client specific
	this.defaultAbility = new ABILITY('melee_attack', this);
	
	this.set();	
}


// sets all the necessary data for UNIT from UNITDATA
UNIT.prototype.set = function() {
	
	var unitdata = EOE.game.unitdata[this.type];
	
	this.name = unitdata.name;
	this.attributes = JSON.parse(unitdata.attributes);
	this.abilities = JSON.parse(unitdata.abilities);
		
	for(var p in this.attributes) this[p]=this.attributes[p];
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
	
	// sets the images of the editor  @TODO: trigger this on the setUNITDATA event
	getBlock('epoch-editor').setUnitImages();
	
	// set off the event that unit data has been received
	var setEvent = new CustomEvent('setUNITDATA', { detail: this } );
	window.dispatchEvent(setEvent);
}


// returns all the types of units for a given element
// STRING element - 'fire', 'air', etc.
UNITDATA.prototype.getUnitTypesByElement = function(element) {
	
	var unitTypes = [];
	
	for (var property in this) {
		if (this.hasOwnProperty(property)) {
			var unit = this[property];
			var attributes = JSON.parse(unit.attributes);
			var unitElement = attributes.element;
			if (unitElement == element) { unitTypes.push(property); }
		}
	}
	
	return unitTypes;
}