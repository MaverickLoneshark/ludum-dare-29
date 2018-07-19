// Buildings.js
// For defining the types of buildings in the game.
//
// Ludum Dare 29
// Tustin2121 & MaverickLoneshark
//

//Building : Base class for all building types.
(function(){
	function Building(opts) {
		if (!(this instanceof Building))
			return new Building();
		
		if (opts === false) return; //for prototyping only
		
		$.extend(this, opts);
		
		this.health = this.maxhealth;
	}
	
	Building.fn = Building.prototype = {
		x : 0,
		y : 0,
		width : 2,
		height : 2,
		
		health: 0,
		maxhealth: 100,
		
		name : "{Generic Building}",
		buildtime : 10,
		buildprogress : 0,
		
		population : 0,
		
		cssclass : "building-generic",
		
		sprite : null, //The on-screen representation for this instance
		
		damage : function(amt) {
			this.health -= amt;
			console.log("DAMAGE!", 1 - (this.health / this.maxhealth))
			
			var dmgLvl = Math.ceil((1 - (this.health / this.maxhealth)) * 3);
			$(this.sprite).removeClass("dmg0 dmg1 dmg2 dmg3").addClass("dmg"+dmgLvl);
			
			if (this.health <= 0) {
				return true; //WE ARE DED
			} else {
				return false; 
			}
		}, 
		
		toString : function() {
			return "["+this.fn.name+" @ ("+this.x+", "+this.y+")]";
		},
	};
	window.Building = Building;
})();


//City : The starting cities
(function(){
	function City(opts) {
		if (!(this instanceof City))
			return new City(opts);
		Building.call(this, opts);
	}
	City.fn = City.prototype = new Building(false);
	
	$.extend(City.fn, {
		name : "City",
		width : 4,
		height : 2,
		maxhealth: 40,
		population : 1800, //starting population
		buildtime : -1, //CANNOT BUILD
		
		cssclass : "building-city",
	});
	
	window.City = City;
})();


//Outpost : The three manual outposts at the start of the game.
(function(){
	function Outpost(opts) {
		if (!(this instanceof Outpost))
			return new Outpost(opts);
		Building.call(this, opts);
	}
	Outpost.fn = Outpost.prototype = new Building(false);
	
	$.extend(Outpost.fn, {
		name : "Outpost",
		width : 2,
		height : 2,
		maxhealth: 50,
		population : 200, //starting population
		buildtime : -1, //CANNOT BUILD
		
		cssclass : "building-outpost",
	});
	
	window.Outpost = Outpost;
})();


//Bunker : A bunker for refugees
(function(){
	function Bunker(opts) {
		if (!(this instanceof Bunker))
			return new Bunker(opts);
		Building.call(this, opts);
	}
	Bunker.fn = Bunker.prototype = new Building(false);
	
	Bunker.fn.name = "Bunker";
	window.Bunker = Bunker;
})();

/*
//Bunker : A bunker for refugees
(function(){
	function Bunker(opts) {
		if (!(this instanceof Bunker))
			return new Bunker(opts);
		Building.call(this, opts);
	}
	Bunker.fn = Bunker.prototype = new Building(false);
	
	Bunker.fn.name = "Bunker";
	window.Bunker = Bunker;
})();
*/
