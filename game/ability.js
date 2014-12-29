function ABILITY(type, unit) {
	
	// setup variables
	this.type = type;
	this.unit = unit;
	
	// init variables
	this.name = '';
	this.cooldown = 0;
	this.targets = [ 'enemy' ];		// determines what needs to be targeted, ex: 'tile', 'enemy', 'ally'
	this.effects = [ 'melee_attack' ];
	
	// game variables
	this.timer = 0;
	
	
	//this.init();	
}


// sets all the necessary data for ABILITY from ABILITYDATA
ABILITY.prototype.init = function() {
	
	var abilitydata = EOE.game.abilitydata[this.type];
	
	this.name = 0;// modify type
	this.cooldown = abilitydata.cooldown;
	this.targets = JSON.parse(abilitydata.targets);
	this.effects = JSON.parse(abilitydata.effects);		
}

// Abilitydata has the following structure after being set
// ABILITYDATA { thunderclap: {unit}, nightmare: {unit} }
function ABILITYDATA() {
	
	// when ABILITYDATA is created, request the data from the server
	// when data is received, it is sent to init function
	SEND('getABILITYDATA');
}


// when ABILITYDATA is received from server, socket uses init function to initialize the data
// @param abilitydata -- [ { type, cooldown, targets, effects } ]
ABILITYDATA.prototype.init = function(abilitydata) {

	var setAbility = function(ability) {
		this[ability.type] = ability;	
	}
	abilitydata.forEach( setAbility.bind(this) );
}