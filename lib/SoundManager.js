/*
	* Ludum Dare 29
	* Tustin2121 & MaverickLoneshark
*/

(function()
{
	var SIMULTANEOUS_SOUNDS = 4;
	
	function SoundManager()
	{
		this.BGM = document.createElement("audio");
		this.BGM.autoplay = false;
		this.BGM.loop = true;
		
		this.sound = new Array();
		
		for(var i = 0; i < SIMULTANEOUS_SOUNDS; i++)
		{
			this.sound[i] = document.createElement("audio");
			this.sound[i].autoplay = false;
		}
		
		return;
	}
	
	SoundManager.prototype.playMusic = function(source)
	{
		this.BGM.src = source;
		this.BGM.play();
		
		return;
	}
	
	SoundManager.prototype.pauseMusic = function()
	{
		this.BGM.pause();
		
		return;
	}
	
	SoundManager.prototype.playSound = function(source)
	{
		for(var i = 0; i < SIMULTANEOUS_SOUNDS; i++)
		{
			//will play sound if there is a free audio player available
			if(this.sound[i].ended || (!this.sound[i].src)/*(!this.sound[i].currentTime)*/)
			{
				this.sound[i].src = source;
				this.sound[i].play();
				break;
			}
		}
		
		return;
	}
	
	//expose the SoundManager class
	window.SoundManager = SoundManager;
})();
