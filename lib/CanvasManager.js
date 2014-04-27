/*
 * Ludum Dare 29
 * Tustin2121 & MaverickLoneshark
 */

/* Canvas Manager Object */
(function() {
	/*-- Constants --*/
	var CANVAS_WIDTH = 1024;
	var CANVAS_HEIGHT = 256;
	
	//Constructor
	function CanvasManager() {
		
	}
	
	/*-- "Private" Variables --*/
	
	
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
			canvas.css("top", index * 256);
			
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
			this.contexts[index].clearRect(0, 0, 1024, 256);
			
			//this.contexts[index].DRAWFUNCTION();
		},
		
		toString : function(){ return "[CanvasManager: "+this.canvases.length+" canvases]"}
	};
	
	//expose the CanvasManager class
	window.CanvasManager = CanvasManager;
})();
