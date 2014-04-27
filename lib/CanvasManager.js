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
				ldGame.projectile_manager.initializeProjectile(0, x, y, (Math.random() * 10) - 5, (Math.random() * 10) - 5);
				
				return;
			};
			
			this.contexts[index] = canvas[0].getContext("2d");
			
			this.canvases.push(canvas);
			
			$("#sky").append(canvas);
		},
		
		// redrawAll() : redraws all canvases registered in the canvas manager
		redrawAll : function() {
			for (var i = 0; i < this.contexts.length; i++) {
				this.redraw(i);
			}
		},
		
		// redraw() : draws a given canvas
		redraw : function(index) {
			var context = this.contexts[index];
			
			var dirty = false;
			
			//draw contained projectiles
			var projectiles = ldGame.projectile_manager.projectiles;
			
			for(var p = 0; p < projectiles.length; p++)
			{
				var offheight =  (index * CANVAS_HEIGHT);
				
				//turns out the buffer is needed because the alternative solution involves checking & refreshing for when projectiles LEAVE the canvas
				if(projectiles[p].active &&
					((projectiles[p].y[0] >= offheight - CANVAS_DRAW_BUFFER) &&
					(projectiles[p].y[0] < offheight + CANVAS_HEIGHT + CANVAS_DRAW_BUFFER)) ||
					((projectiles[p].y[ldGame.projectile_manager.TRAIL_LENGTH - 1] >= offheight - CANVAS_DRAW_BUFFER) &&
					(projectiles[p].y[ldGame.projectile_manager.TRAIL_LENGTH - 1] < offheight + CANVAS_HEIGHT + CANVAS_DRAW_BUFFER)))
				{
					if(!dirty)
					{
						context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
						dirty = true;
					}
					
					context.beginPath();
					context.moveTo(projectiles[p].x[0], projectiles[p].y[0] - offheight);
					for(var i = 1; i < projectiles[p].x.length; i++)
					{
						context.lineTo(projectiles[p].x[i], projectiles[p].y[i] - offheight);
						context.moveTo(projectiles[p].x[i], projectiles[p].y[i] - offheight);
					}
					
					switch(projectiles[p].type)
					{
						case 0:
							context.strokeStyle="#9999FF";
						break;
						
						case 1:
							context.strokeStyle="#FF0000";
						break;
						
						default:
							context.strokeStyle="#FF0000";
						break;
					}
					context.lineWidth=5;
					context.fillStyle="#FFFFFF";
					context.fillRect(projectiles[p].x[0] - 2, projectiles[p].y[0] - offheight - 2, 4, 4);
					context.stroke();
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
