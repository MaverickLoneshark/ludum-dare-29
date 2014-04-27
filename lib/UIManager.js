// UIManager.js
// The UI Manager object, for defining the UI manager
//
// Ludum Dare 29
// Tustin2121 & MaverickLoneshark
// 

(function(){
	var ui = {
		righthud : null,
		
		init : function() {
			this.righthud = $("<div>").addClass("right-hud").appendTo("body");
			this.lefthud  = $("<div>").addClass( "left-hud").appendTo("body");
			this.midhud   = $("<div>").addClass( "mid-hud" ).appendTo("body");
		},
		
		
	};
	
	ui.fn = ui.prototype;
	window.ldGame.ui_manager = ui;
	
})();
