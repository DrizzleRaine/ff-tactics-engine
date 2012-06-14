var Game = {
	_canvas: null, // game canvas
	_context: null, // game canvas context
	_gameTimerID: null, // game timer ID
	_world: null, // the world
	_players: null, // player engines array
	_totalPlayers: 0, // total number of players
	_interval: 0, // interval of game tick
	_TileEngine: null, // tile engine
	_moveID: 0, // moveID = move counter
	_maxZindex: 0, // the most front z-index
	_activePlayer: null, // active player object
	_actionPanelID: null, // DOM ID for action panel
	_waitForAction: false, // when game is waiting on a player to make an action
	_selectedAction: null,
	_userSessionID: null,
	_viewport: null, // game viewport
	// initialize game: display, world (use world structure), other config
	// callback is a function to call once background layer is loaded
	init: function(display, world, others, callback){
		Game._canvas = display.canvas;
		Game._context = display.canvas.getContext('2d');
		Game._viewport = display.viewport;

		Game._players = new Array();
		Game._interval = display.interval;
		Game._world = world;
		Game._maxZindex = 2 * world._tiles.length; // 2n
		
		Game._actionPanelID = others._actionPanelID;
		Game._userSessionID = others._userSessionID;

		Game.createWorld(callback);
	},
	// create the world and the background (static) layer
	createWorld: function(callback) {
		Game._TileEngine = TileEngine;
		Game._TileEngine.init(Game._world);
		
		callback();
	},
	// set interval for game ticker
	setInterval: function(interval){
		Game._interval = interval;
	},
	// add player (use player structure)
	addPlayer: function(player){
		Game._players[Game._totalPlayers] = createPlayer();
		Game._players[Game._totalPlayers].init(player, Game._context, Game._TileEngine);
		Game._totalPlayers++;
	},
	// start the game
	start: function() {
		Game.gameTimerID = setInterval(Game.render, Game._interval);
		Message.addMessage("Game Started");
		Game.nextTurn();
	},
	// pause the game
	pause: function(){
		clearInterval(this.gameTimerID);
		Message.addMessage("Game Paused");
	},
	updateViewport: function(viewport) {
		Game._viewport = viewport;
	},
	// render!
	render: function() {
		Game._context.clearRect(0,0,Game._viewport.width, Game._viewport.height);  //clear main canvas
		//background img
		//Game._context.drawImage(Game._world._imgObj, Game._viewport.x, Game._viewport.y, Game._viewport.width, Game._viewport.height, 0, 0, Game._viewport.width, Game._viewport.height);

		var playersZOrder = Game.getSortedPlayers();
		// render by z-index highest first
		for (z = 0; z < Game._maxZindex; z++) { 
			var tiles = Game._TileEngine._tilesZOrder[z];
			var total_tiles = tiles.length;
			// render block and movable tiles
			for (j = 0; j < total_tiles; j++) {
				var tile = tiles[j];
				if (tile._imgObj != null && isObjInViewport(Game._viewport, tile._pos.x, tile._pos.y, tile._dimension.width, tile._dimension.height)) {
					Game._context.drawImage(tile._imgObj, 
						tile._offset.x, tile._offset.y, 
						tile._dimension.width, tile._dimension.height, 
						tile._pos.x - Game._viewport.x, tile._pos.y - Game._viewport.y, 
						tile._dimension.width, tile._dimension.height);
				}
			}
			// render players
			if (playersZOrder[z] instanceof Array) {
				len = playersZOrder[z].length;
				for (i = 0; i < len; i++) {playersZOrder[z][i].render(Game);}
			}
		}
		FPS.fps_count++;
	}, 
	getSortedPlayers: function() {
		var order = new Array();
		var len = 0;
		for (i = 0; i < Game._totalPlayers; i++) {
			player = Game._players[i];
			if (player._status == 'moving') {
				tile = player._target;
			} else {
				tile = player._onTileObj;
			}
			if (!(order[tile._zIndex] instanceof Array)) {
				order[tile._zIndex] = new Array();
			}
			order[tile._zIndex].push(player);
		}
		return order;
	},
	// get next player's turn
	getTurn: function() {
		player = Game._players[0];
		for (i = 1; i < Game._totalPlayers; i++) {
			if (Game._players[i]._meta._meter < player._meta._meter) {
				player = Game._players[i];
			} else if (Game._players[i]._meta._meter == player._meta._meter) {
				if (Game._players[i]._meta._lastMoveID < player._meta._lastMoveID) {
					player = Game._players[i];
				}
			}
		}
		Message.addMessage('<br>'+player._meta._username+'\'s turn!');	
		player._meta._lastMoveID = ++Game._lastMoveID;
		Game._activePlayer = player;
		$('#current-turn').html(player._meta._username);
		$('#current-energy').html("Energy: "+player._meta._meter);
		$('#current-hp').html("HP: "+player._meta._hp);
		return player;
	},
	// Game proceed to next turn
	nextTurn: function() {
		Game.getTurn(); // set the active player
		Game.showActionPanel(); // show action panel (only to active player), once he picks, call setAction
		centerViewport(Game._activePlayer._position.x, Game._activePlayer._position.y);
		//Message.addMessage(JSON.stringify(Game._selectedAction));
	},
	showActionPanel: function() { 
		Game._waitForAction = true;
		// check if user sess id = player sess id
		//if (Game._activePlayer._meta._session_id == Game._userSessionID) {
			$('#'+Game._actionPanelID).slideDown(); // show panel
		//} 	
	},
	// setAction is executed on the action listener, which listen to either user (if user = activeUser) or network (if user != activeUser)
	setAction: function(action) { 
		$('#'+Game._actionPanelID).slideUp(); // hide panel
		Game._selectedAction = action;
		Game._TileEngine.showMovableTiles(Game._activePlayer, action.range); // show movable tiles for player
	},
	// when a click is captured
	captureClick: function(mouse) {
		if (Game._waitForAction && Game._selectedAction != null) {
			switch (Game._selectedAction.target) {
				case 'self':
				break;
				case 'ally':
				break;
				case 'enemy':
				  var target = false;
					for (var i  = 0; i < Game._totalPlayers && !target; i++) {
						if (Game._players[i]._meta._username != Game._activePlayer._meta._username) {
							target = Game._players[i].isClicked(mouse);
						}
					}
				break;
				case 'tile':
					var target = Game._TileEngine.getMovableTile(mouse, Game._activePlayer, Game._selectedAction.range);
				break;
			}

			if (target != false) {
				Game._TileEngine.clearMovableTiles();
				Game._selectedAction.func(Game._activePlayer, target, Game._selectedAction.params,Game.endTurn);
				Game._waitForAction = false;
			}
		}
	},
	endTurn: function() {
		Game._selectedAction = null;
		Game.nextTurn(); // clear turn
	}
}
