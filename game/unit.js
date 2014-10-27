function UNIT(id, tileId, type, attributes) {
	
	this.id = id;
	this.tileId = tileId;
	this.type = type;
	this.attributes = EOE.game.unitdata[type];
	
}

function UNITDATA() {
	
	var unitdata = {
		vanguard: { 
				life: 18,
				damage: 7,
				defense: 4,
				speed: 5,
				sight: 5,
				reveal: 2,
				range: 2,
				attacks: 1,
				blocks: 3,
				attackAbilities: [],
				blockAbilities: [],
				castAbilities: ["Sixth Sense", "Heat Shield", "Meteor"],
				auras: [],
				element: "Fire"			 	
		}
	}
	
	return unitdata;
}