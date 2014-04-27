// main.js
// Place to define the core app context and initialization code!
// 
// Ludum Dare 29
// Tustin2121 & MaverickLoneshark
//

//COMPATABILITY TESTING!!
{
	var err = null;
	
	//TODO we may not need this test, carry over from js-if
	if (![].indexOf  //test presense and capabilities of indexOf
		|| ["hello", "out", "there"].indexOf("out") != 1
		|| [5, 6, 7, 8].indexOf(2) != -1
	){
		err = "Your browser does not support the most basic required methods "+
			"for this game. Please, for the sake of everyone, get a real, modern browser.";
	}
	
	var elem = document.createElement('canvas');
	if (!(elem.getContext && elem.getContext('2d'))) {
		err = "Your browser does not support the canvas tag. Please use a browser "+
			"that does, such as Chrome or Firefox.";
	}
	
	if (err) {
		$(function(){ //On document ready, because the document isn't even loaded at this point
			$("#errReason").html(err);
		});
		throw err; //stops this file from processing
	}
}
//Phew, ok, begin actual definitions of things

(function(){ //if console is not on this page, provide a dummy to prevent errors
	if (window.console) return;
	window.console = {
		log: function(){}, //logs a message
		warn: function(){}, //logs a warning with icon
		info: function(){}, //logs a message with icon
		debug: function(){}, //logs a message with debug icon, link?
		error: function(){}, //logs an error message with icon
		group: function(){}, //indents the following messages into a group
		groupCollapsed: function(){}, //indents the following messages into a group (collapsed)
		groupEnd: function(){}, //ends above grouping
	};
})();


/* Master App Object */
(function(){
	// This object defines a base point for all references to major game objects
	// it is "ldGame" in the window context
	var core = {
		game_manager : null,
		canvas_manager : null,
		ui_manager : null,
		
		func : {},  //Common functions! Defined in common.js
		
		// init() : called once the DOM is ready, initializes the game!
		init : function() {
			this.canvas_manager = new CanvasManager();
			this.canvas_manager.addCanvas(); //start with 3 canvases!
			this.canvas_manager.addCanvas(); //TODO refine....?
			this.canvas_manager.addCanvas();
			
			this.projectile_manager = new ProjectileManager();
			
			this.ui_manager.init();
			
			this.game_manager = new GameManager();
			this.game_manager.init();
		},
	};
	
	//since we're not making instances of the core, the prototype isn't used for prototyping
	core.fn = core.prototype = core.func;
	
	//
	window.ldGame = core;
	
})();

$(function(){ //OnReady! (JQuery event!)
	// Init the canvases and anything that might need initiing here!
	ldGame.init();
	
	// Start up the attract / title screen!
	
	//Lastly!
	$("#error").remove(); //remove the error message
});
