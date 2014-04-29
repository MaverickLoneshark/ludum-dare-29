/*
 * Ludum Dare 29
 * Tustin2121 & MaverickLoneshark
 */

/* Canvas Manager Object */
(function(){
	/*-- "Private" Variables --*/
	/*-- Constants --*/
	var CANVAS_WIDTH = 1024;
	var CANVAS_HEIGHT = 256;
	var CANVAS_DRAW_BUFFER = 32;
	
	//Constructor
	function CanvasManager(){}
	
	/*-- "Private" Methods --*/
	
	//class definition
	CanvasManager.fn = CanvasManager.prototype = {
		/*-- "Public" Variables --*/
		canvases : [],
		contexts : [],
		
		/*-- "Public" Methods --*/
		//addCanvas() : 
		addCanvas : function() {
			var canvas = $("<canvas width='"+CANVAS_WIDTH+"' height='"+CANVAS_HEIGHT+"'>");
			var index = this.canvases.length;
			canvas.css("top", index * CANVAS_HEIGHT);
			
			canvas[0].onmouseup = function(event)
			{
				var x = event.pageX - canvas.offset().left;
				var y = event.pageY;
				ldGame.projectile_manager.initializeProjectile(0, x, y);
				
				return;
			};
			
			this.contexts[index] = canvas[0].getContext("2d");
			
			this.canvases.push(canvas);
			
			$("#sky").append(canvas);
		},
		
		// redrawAll() : redraws all canvases registered in the canvas manager
		redrawAll : function(force) {
			for (var i = 0; i < this.contexts.length; i++) {
				this.redraw(i, force);
			}
		},
		
		// redraw() : draws a given canvas
		redraw : function(index, force) {
			var context = this.contexts[index];
			
			var dirty = false;
			
			if(force)
			{
				context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			}
			
			//draw contained projectiles
			var projectiles = ldGame.projectile_manager.projectiles;
			
			for(var p = 0; p < projectiles.length; p++)
			{
				var offheight =  (index * CANVAS_HEIGHT);
				
				//turns out the buffer is needed because the alternative solution involves checking & refreshing for when projectiles LEAVE the canvas
				if(projectiles[p].active &&
					(((projectiles[p].y[0] >= offheight - CANVAS_DRAW_BUFFER) &&
					(projectiles[p].y[0] < offheight + CANVAS_HEIGHT + CANVAS_DRAW_BUFFER)) ||
					((projectiles[p].y[ldGame.projectile_manager.TRAIL_LENGTH - 1] >= offheight - CANVAS_DRAW_BUFFER) &&
					(projectiles[p].y[ldGame.projectile_manager.TRAIL_LENGTH - 1] < offheight + CANVAS_HEIGHT + CANVAS_DRAW_BUFFER))))
				{
					if(!dirty)
					{
						context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
						dirty = true;
					}
					
					context.beginPath();
					
					switch(projectiles[p].type)
					{
						case 0:
							context.strokeStyle = "#9999FF";
						break;
						
						case 1:
						case 2:
						case 3:
							context.strokeStyle = "#FF0000";
						break;
						
						case 4:
							context.strokeStyle = "#FFFF00";
						break;
						
						case 5:
							context.strokeStyle = "#00FF00";
						break;
						
						case 9:
							var date = new Date();
							
							switch(date.getTime() % 4)
							{
								case 0:
									context.strokeStyle = "#DD4444";
									context.fillStyle = "#AADDDD";
								break;
								
								case 1:
									context.strokeStyle = "#44DD44";
									context.fillStyle = "#DDAADD";
								break;
								
								case 2:
									context.strokeStyle = "#4444DD";
									context.fillStyle = "#DDDDAA";
								break;
								
								default:
									context.strokeStyle = "#DDDDDD";
									context.fillStyle = "#444444";
								break;
							}
							
							context.lineWidth = 1;
							context.arc(projectiles[p].x[0], projectiles[p].y[0] - offheight, projectiles[p].morph, 0, 2 * Math.PI);
							context.fill();
						break;
						
						default:
						break;
					}
					
					context.moveTo(projectiles[p].x[0], projectiles[p].y[0] - offheight);
					for(var i = 1; i < projectiles[p].x.length; i++)
					{
						context.lineTo(projectiles[p].x[i], projectiles[p].y[i] - offheight);
						context.moveTo(projectiles[p].x[i], projectiles[p].y[i] - offheight);
					}
					context.globalAlpha = 0.5;
					context.lineWidth=5;
					context.stroke();
					context.globalAlpha = 1.0;
					context.fillStyle="#FFFFFF";
					context.fillRect(projectiles[p].x[0] - 2, projectiles[p].y[0] - offheight - 2, 4, 4);
					
				}
			}
		},
		
		toString : function(){ return "[CanvasManager: "+this.canvases.length+" canvases]"}
	};
	
	CanvasManager.prototype.CANVAS_WIDTH = CANVAS_WIDTH;
	CanvasManager.prototype.CANVAS_HEIGHT = CANVAS_HEIGHT;
	
	//expose the CanvasManager class
	window.CanvasManager = CanvasManager;
})();
