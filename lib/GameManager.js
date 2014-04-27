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
	
	//Constructor
	function GameManager() {
		this.grid = new Array(STARTING_ROWS);
		for (var i = 0; i < STARTING_ROWS; i++) {
			this.grid[i] = new Array(GAME_FIELD_WIDTH);
			if (i >= STARTING_GROUND_LEVEL)
				this.generateDirt(i);
		}
		this.buildings = [];
	}
	
	GameManager.fn = GameManager.prototype = {
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
			
			//======Testing Loop========
			//rendering
			setInterval(function(){
				ldGame.canvas_manager.redrawAll();
			}, 25); //40 FPS (attempt)
			
			//physics
			var date = new Date();
			var deltaTime = date.getTime();
			setInterval(function(){
				var date = new Date();
				var currentTime = date.getTime();
				deltaTime = currentTime - deltaTime;
				
				ldGame.projectile_manager.update(deltaTime);
			}, 0); //constant updates
			//=======================
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
