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
			
			var buildings = document.getElementById('buildings');
			buildings.onmouseup = function(event)
			{
				var x = event.pageX - $(buildings).offset().left;
				var y = event.pageY;
				ldGame.projectile_manager.initializeProjectile(0, x, y, (Math.random() * 10) - 5, (Math.random() * 10) - 5);
				
				return;
			}
		},
		
		
	};
	
	ui.fn = ui.prototype;
	window.ldGame.ui_manager = ui;
	
})();
