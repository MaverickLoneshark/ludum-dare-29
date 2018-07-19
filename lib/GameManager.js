// GameManager.js
// The Game Manager object, for defining the main game manager.
//
// Ludum Dare 29
// Tustin2121 & MaverickLoneshark
// 

(function() {
	/*-- Constants --*/
	var GRID_PIXEL_SIZE = 32,
		GAME_FIELD_WIDTH = 32,
		STARTING_ROWS = 26,
		STARTING_GROUND_LEVEL = 21,
		LOWEST_ROW_LIMIT = 97,
		playing = false;
	
	//Constructor
	function GameManager() {
		var i;
		
		this.grid = new Array(STARTING_ROWS);
		for (i = 0; i < STARTING_ROWS; i++) {
			this.grid[i] = new Array(GAME_FIELD_WIDTH);
			if (i >= STARTING_GROUND_LEVEL)
				this.generateDirt(i);
		}
		this.buildings = [];
		
		this.startTime = new Date().getTime();
	}
	
	function game_update() {
		var currentTime = new Date().getTime(),
			deltaTime = currentTime - game_update.lastUpdate;
		
		game_update.lastUpdate = currentTime;
		
		//======= Update ========
		if (playing) {
			generateEnemyProjectile(currentTime);
			ldGame.projectile_manager.collisionDetection();
			ldGame.projectile_manager.update(deltaTime);
		}
		//===== End Updates =====
	}
	
	function generateEnemyProjectile(currentTime) {
		var origin_x = (Math.random() * ldGame.canvas_manager.CANVAS_WIDTH),
			target = ldGame.game_manager.getRandomBuilding(),
			target_x,
			target_y,
			velocity;
		
		if(!this.nextMissile) {
			this.nextMissile = currentTime;
		}
		
		if(this.nextMissile <= currentTime) {
			this.nextMissile = currentTime + (Math.floor(Math.random(30) + 1) * 2500);
			
			if (!target) return;
			
			target_x = (target.x + (target.width /2)) * GRID_PIXEL_SIZE; //(Math.random() * ldGame.canvas_manager.CANVAS_WIDTH);
			target_y = (target.y + (target.height/2)) * GRID_PIXEL_SIZE;
			velocity = calculateVelocity(origin_x, 0, target_x, target_y);//ldGame.canvas_manager.CANVAS_HEIGHT * ldGame.canvas_manager.canvases.length)
			
			ldGame.projectile_manager.initializeProjectile(Math.floor(Math.random() * 5) + 1, origin_x, 0, velocity.x, velocity.y);
		}
		
		function calculateVelocity(origin_x, origin_y, target_x, target_y) {
			var x_vel = target_x - origin_x,
				y_vel = target_y - origin_y,
				distance_squared = (x_vel * x_vel) + (y_vel * y_vel);
			
			x_vel /= Math.sqrt(distance_squared);
			y_vel /= Math.sqrt(distance_squared);
			
			return {
				x: x_vel,
				y: y_vel
			};
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
		
		beginGame : function() {
			if (playing) return;
			
			$("#title").hide();
			playing = true;
			ldGame.sound_manager.playMusic("snd/BGM.wav");
		},
		
		updateGroundLevel : function() {
			//determine how far down the ground needs to be - 8 rows below the lowest building
			var lowest_bld_level = 0,
				i,
				bld;
			
			for (i = 0; i < this.buildings.length; i++) {
				bld = this.buildings[i];
				
				if (lowest_bld_level < bld.y) 
					lowest_bld_level = bld.y
			}
			
			if (this.grid.length < lowest_bld_level+8) {
				this.extendGround(lowest_bld_level+8 - this.grid.length);
			}
		},
		
		extendGround : function(addRows) {
			var oldlimit = this.grid.length,
				newlimit = oldlimit + addRows,
				i,
				divheight = newlimit*GRID_PIXEL_SIZE;
			
			if (newlimit > LOWEST_ROW_LIMIT) newlimit = LOWEST_ROW_LIMIT;
			
			for (i = oldlimit; i < newlimit; i++) {
				this.grid[i] = new Array(GAME_FIELD_WIDTH);
				this.generateDirt(i);
			}
			
			if (newlimit >= LOWEST_ROW_LIMIT) 
				divheight += 160; //show that lava!
			$("#buildings, #outerWrapper").css("height", divheight);
			
			while (newlimit > (ldGame.canvas_manager.canvases.length+1) * 8) {
				ldGame.canvas_manager.addCanvas();
			}
		},
		
		//getRandomBuilding : usually for finding targets, can be building of specific type
		getRandomBuilding : function(bclass) {
			var applicable = [],
				i,
				rand;
			
			if (!bclass) bclass = Building;
			
			
			for (i = 0; i < this.buildings.length; i++) {
				if (this.buildings[i] instanceof bclass) 
					applicable.push(this.buildings[i]);
			}
			
			rand = Math.floor(Math.random() * applicable.length);
			
			return applicable[rand];
		},
		
		getNearestBuilding : function(bclass, mouse_x, mouse_y) {
			var applicable = [],
				shortest_dist = 10000000,
				closest_bld = null,
				i,
				bld,
				posx,
				posy,
				dist;
			
			for(i = 0; i < this.buildings.length; i++) {
				if (this.buildings[i] instanceof bclass) 
					applicable.push(this.buildings[i]);
			}
			
			for (i = 0; i < applicable.length; i++) {
				bld = applicable[i];
				posx = (bld.x + (bld.width /2)) * GRID_PIXEL_SIZE;
				posy = (bld.y + (bld.height/2)) * GRID_PIXEL_SIZE;
				dist = ((mouse_x - posx) * (mouse_x - posx)) + ((mouse_y - posy) * (mouse_y - posy));
				
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
			var i,
				rdex,
				dirt;
			
			for (i = 0; i < GAME_FIELD_WIDTH; i++) {
				rdex = Math.floor(Math.random()*8);
				
				dirt = $("<div>").addClass("dirt").addClass("r"+rdex);
				dirt.css({ "top": rowindex*GRID_PIXEL_SIZE, "left": i*GRID_PIXEL_SIZE });
				dirt.appendTo("#buildings");
				
				this.grid[rowindex][i] = dirt;
			}
		},
		
		addBuilding : function(bclass, x, y) {
			var b = new bclass({
					"x" : x,
					"y" : y,
				}),
				h,
				w,
				div = $("<div>").addClass(b.cssclass).addClass("dmg0");
			
			this.buildings.push(b);
			
			for (h = y; h < y+b.height; h++) {
				for (w = x; w < x+b.width; w++) {
					this.grid[h][w] = b;
				}
			}
			
			div.css({ "left":GRID_PIXEL_SIZE*x , "top":GRID_PIXEL_SIZE*y });
			div.appendTo("#buildings");
			
			b.sprite = div;
			div.data("object", b);
		},
		
		removeBuilding : function(bld) {
			var x,
				y,
				i,
				alive = false;
			
			for (x = bld.x; x < bld.x + bld.width; x++) {
				for (y = bld.y; y < bld.y + bld.height; y++) {
					delete this.grid[y][x];
				}
			}
			
			bld.sprite.remove();
			
			for (i = 0; i < this.buildings.length; i++) {
				if (this.buildings[i] === bld){
					delete this.buildings[i];
				}
				else if(this.buildings[i]) {
					alive = true;
				}
			}
			
			if(!alive) {
				document.getElementById("game-over").hidden = false;
				document.getElementById("buildings").onmouseup = function() {
					location.reload();
				};
			}
		},
		
		updatePopulation : function() {
			var i;
			
			this.population = 0;
			
			for (i = 0; i < this.buildings.length; i++) {
				this.population += this.buildings[i].population;
			}
		},
		
		/** returns either null or an object **/
		buildingCollision : function(x, y) {
			var bld;
			
			x = Math.floor(x / GRID_PIXEL_SIZE);
			y = Math.floor(y / GRID_PIXEL_SIZE);
			
			if (y < 0 || y >= this.grid.length) return false;
			if (x < 0 || x > GAME_FIELD_WIDTH) return false;
			
			bld = this.grid[y][x]; //convert to grid coords
			
			if (!bld) return false;
			
			if (bld instanceof Building) {
				if (bld.damage(10)) this.removeBuilding(bld);
			} 
			else { //It is dirt
				bld.remove();
				delete this.grid[y][x];
			}
			
			return true;
		},
	}
	window.GameManager = GameManager;
	
})();
