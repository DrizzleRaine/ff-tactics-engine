var GAME_CANVAS = document.getElementById('game-layer');
if (isMobile) {
	GAME_CANVAS.width = window.innerWidth;
	GAME_CANVAS.height = window.innerHeight;
}
var GAME_CONTEXT = GAME_CANVAS.getContext('2d');
var INTERVAL = 40; //ms = 25 frames per sec
var OTHERS = {
	_actionPanelID: 'action-panel',
	_userSessionID: '1234567890'
}
var VIEWPORT = {
	x: 0, y: 0,
	width: GAME_CANVAS.width, height: GAME_CANVAS.height
}
// real width x height = 800x600
var DISPLAY = {
	viewport: VIEWPORT,
	canvas: GAME_CANVAS,
	interval: INTERVAL
};

var start_game = function(percent) {
	Message.addMessage((parseFloat(percent) * 100)+'% assets have been loaded<br>', false);	
	if (percent == 1) {
		Game.init(DISPLAY, WORLD, OTHERS, proceed);
	}
}

var proceed = function() {
	Game.addPlayer(PLAYER1_META);
	Game.addPlayer(PLAYER2_META);
	//Game.addPlayer(PLAYER3_META);
	Game.start();
}

if(CanvasHelper.isCompatible()){  //check canvas support before intializing
	CanvasHelper.loadAssets(ASSETS, start_game);
}
else {
	Message.addMessage('Your Browser Does not support HTML5 Canvas!');	
	alert('Your Browser Does not support HTML5 Canvas!');
}
