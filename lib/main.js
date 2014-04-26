/*
Ludum Dare 29
Tustin2121 & MaverickLoneshark
*/

/*--Dependencies--*/
/*
//Damn it, JQuery. I still don't understand you...
$.getScript( "CanvasManager.js", function( data, textStatus, jqxhr ) {
	console.log( data ); // Data returned
	console.log( textStatus ); // Success
	console.log( jqxhr.status ); // 200
	console.log( "Load was performed." );
});
*/

/* Master App Object */
function App()
{
	/*--Private Members--*/
	var canvas_manager = new CanvasManager();
	
	/*--Public Members--*/
	
	/*--Private Methods--*/
	(function main()
	{
		canvas_manager.addCanvas();
	})();
	
	return;
}

/*--Public Methods--*/
/*
App.prototype.??? = function()
{
	return;
}
*/