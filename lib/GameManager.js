// GameManager.js
// The Game Manager object, for defining the main game manager.
//
// Ludum Dare 29
// Tustin2121 & MaverickLoneshark
// 

(function(){
	/*-- Constants --*/
	var GRID_PIXEL_SIZE = 32;
	var GAME_FIELD_WIDTH = 32;
	
	var STARTING_ROWS = 26;
	var STARTING_GROUND_LEVEL = 21;
	var LOWEST_ROW_LIMIT = 97;
	
	//Constructor
	function GameManager() {
		this.grid = new Array(STARTING_ROWS);
		for (var i = 0; i < STARTING_ROWS; i++) {
			this.grid[i] = new Array(GAME_FIELD_WIDTH);
			if (i >= STARTING_GROUND_LEVEL)
				this.generateDirt(i);
		}
		this.buildings = [];
		
		this.startTime = new Date().getTime();
		ldGame.sound_manager.playMusic("snd/BGM.wav");
	}
	
	/*-- "Private" Methods --*/
	
	function game_update() {
		var currentTime = new Date().getTime();
		var deltaTime = currentTime - game_update.lastUpdate;
		game_update.lastUpdate = currentTime;
		
		//======= Update ========
		generateEnemyProjectile(currentTime);
		ldGame.projectile_manager.collisionDetection();
		ldGame.projectile_manager.update(deltaTime);
		
		//===== End Updates =====
	}
	game_update.lastUpdate = new Date().getTime();
	
	function generateEnemyProjectile(currentTime)
	{
		if(!this.nextMissile)
		{
			this.nextMissile = currentTime;
		}
		
		if(this.nextMissile <= currentTime)
		{
			this.nextMissile = currentTime + (Math.floor(Math.random(30) + 1) * 1500);
			
			var buildings = document.getElementById('buildings');
			var origin_x = (Math.random() * ldGame.canvas_manager.CANVAS_WIDTH) + buildings.offsetLeft;
			var target_x = (Math.random() * ldGame.canvas_manager.CANVAS_WIDTH) + buildings.offsetLeft;
			var velocity = calculateVelocity(origin_x, 0, target_x, window.innerHeight);
			
			ldGame.projectile_manager.initializeProjectile(Math.floor(Math.random() * 2) + 1, origin_x, 0, velocity.x, velocity.y);
		}
		
		function calculateVelocity(origin_x, origin_y, target_x, target_y)
		{
			var x_vel = target_x - origin_x;
			var y_vel = target_y - origin_y;
			var distance_squared = (x_vel * x_vel) + (y_vel * y_vel);
			x_vel /= Math.sqrt(distance_squared);
			y_vel /= Math.sqrt(distance_squared);
			
			return {x: x_vel,
					y: y_vel};
		}
		
		return;
	}
	
	//class definition
	GameManager.fn = GameManager.prototype = {
		startTime : 0,
		gameTicks : 0,
		
		population : 10000,
		buildings : null,
		
		grid : null,
		
		init : function() {
			this.addBuilding(Outpost, 0, STARTING_GROUND_LEVEL - Outpost.fn.height);
			this.addBuilding(Outpost, 15, STARTING_GROUND_LEVEL - Outpost.fn.height);
			this.addBuilding(Outpost, 30, STARTING_GROUND_LEVEL - Outpost.fn.height);
			
			this.addBuilding(City, 2, STARTING_GROUND_LEVEL - City.fn.height);
			this.addBuilding(City, 6, STARTING_GROUND_LEVEL - City.fn.height);
			this.addBuilding(City, 10, STARTING_GROUND_LEVEL - City.fn.height);
			
			this.addBuilding(City, 18, STARTING_GROUND_LEVEL - City.fn.height);
			this.addBuilding(City, 22, STARTING_GROUND_LEVEL - City.fn.height);
			this.addBuilding(City, 26, STARTING_GROUND_LEVEL - City.fn.height);
			
			this.updateGroundLevel();
			
			//======Testing Loop========
			//rendering
			setInterval(function(){
				ldGame.canvas_manager.redrawAll();
			}, 25); //40 FPS (attempt)
			
			//physics
			setInterval(game_update, 0); //constant updates
			//=======================
		},
		
		updateGroundLevel : function() {
			//determine how far down the ground needs to be - 8 rows below the lowest building
			var lowest_bld_level = 0;
			for (var i = 0; i < this.buildings.length; i++) {
				var bld = this.buildings[i];
				if (lowest_bld_level < bld.y) 
					lowest_bld_level = bld.y
			}
			
			if (this.grid.length < lowest_bld_level+8) {
				this.extendGround(lowest_bld_level+8 - this.grid.length);
			}
		},
		
		extendGround : function(addRows){
			var oldlimit = this.grid.length;
			var newlimit = oldlimit + addRows;
			
			if (newlimit > LOWEST_ROW_LIMIT) newlimit = LOWEST_ROW_LIMIT;
			
			for (var i = oldlimit; i < newlimit; i++) {
				this.grid[i] = new Array(GAME_FIELD_WIDTH);
				this.generateDirt(i);
			}
			
			var divheight = newlimit*GRID_PIXEL_SIZE;
			if (newlimit >= LOWEST_ROW_LIMIT) 
				divheight += 160; //show that lava!
			$("#buildings, #outerWrapper").css("height", divheight);
			
			while (newlimit > (ldGame.canvas_manager.canvases.length+1) * 8) {
				ldGame.canvas_manager.addCanvas();
			}
		},
		
		getNearestBuilding : function(bclass, mouse_x, mouse_y) {
			var applicable = [];
			for (var i = 0; i < this.buildings.length; i++) {
				if (this.buildings[i] instanceof bclass) 
					applicable.push(this.buildings[i]);
			}
			
			var shortest_dist = 10000000;
			var closest_bld = null;
			for (var i = 0; i < applicable.length; i++) {
				var bld = applicable[i];
				var posx = (bld.x + (bld.width /2)) * GRID_PIXEL_SIZE;
				var posy = (bld.y + (bld.height/2)) * GRID_PIXEL_SIZE;
				var dist = ((mouse_x - posx) * (mouse_x - posx)) + ((mouse_y - posy) * (mouse_y - posy));
				if (shortest_dist > dist) {
					shortest_dist = dist;
					closest_bld = bld;
				}
			}
			
			return { 
				x : (closest_bld.x + (closest_bld.width /2)) * GRID_PIXEL_SIZE,
				y : (closest_bld.y + (closest_bld.height/2)) * GRID_PIXEL_SIZE,
				object : closest_bld,
				sprite : closest_bld.sprite,
			};
		},
		
		generateDirt : function(rowindex) {
			for (var i = 0; i < GAME_FIELD_WIDTH; i++) {
				var rdex = Math.floor(Math.random()*8);
				
				var dirt = $("<div>").addClass("dirt").addClass("r"+rdex);
				dirt.css({ "top": rowindex*GRID_PIXEL_SIZE, "left": i*GRID_PIXEL_SIZE });
				dirt.appendTo("#buildings");
				
				this.grid[rowindex][i] = dirt;
			}
		},
		
		addBuilding : function(bclass, x, y) {
			var b = new bclass({
				"x" : x,
				"y" : y,
			});
			
			this.buildings.push(b);
			
			for (var h = y; h < y+b.height; h++) {
				for (var w = x; w < x+b.width; w++) {
					this.grid[h][w] = b;
				}
			}
			
			var div = $("<div>").addClass(b.cssclass).addClass("dmg0");
			div.css({ "left":GRID_PIXEL_SIZE*x , "top":GRID_PIXEL_SIZE*y });
			div.appendTo("#buildings");
			
			b.sprite = div;
			div.data("object", b);
		},
		
		updatePopulation : function() {
			this.population = 0;
			for (var i = 0; i < this.buildings.length; i++) {
				this.population += this.buildings[i].population;
			}
		}
	}
	window.GameManager = GameManager;
	
})();
