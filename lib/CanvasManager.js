/*
Ludum Dare 29
Tustin2121 & MaverickLoneshark
*/

/* Canvas Manager Object */
function CanvasManager()
{
	/*--Private Members--*/
	
	/*--Public Members--*/
	this.context = new Array();
	this.context[0] = document.getElementById('Sky').getContext("2d");
	this.context[1] = document.getElementById('Ground1').getContext("2d");
	this.context[2] = document.getElementById('Ground2').getContext("2d");
	this.context[3] = document.getElementById('Ground3').getContext("2d");
	
	/*--Private Methods--*/
	
	return;
}

/*--Public Methods--*/
CanvasManager.prototype.addCanvas = function()
{
	var index = this.context.length + 1;
	var canvas = document.createElement("canvas");
	canvas.id = "Ground" + index;
	canvas.width = '1024';
	canvas.height = '256';
	document.getElementById('CanvasSpace').appendChild(canvas);
	
	this.context[index] = canvas.getContext("2d");
	
	return;
}

CanvasManager.prototype.draw = function(index)
{
	if(index == 0)
	{
		this.context[0].clearRect(0, 0, 1024, 512);
	}
	else
	{
		this.context[index].clearRect(0, 0, 1024, 256);
	}
	
	//this.context[index].DRAWFUNCTION();
	
	return;
}
