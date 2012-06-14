function createPlayer() {
	var Player = {
		_meta: null, // store players data
		_gameContext: null, // game layer context
		_TileEngine: null, // game tile engine
		_position: {x: 0, y: 0}, // player's position in map
		_currentAnimation: 'default', // player's current animation
		_sequence: 0, // player's current animation sequence index
		_tickCounter: 0, // game tick counter
		_status: 'waiting',  //player's status : active (on turn), waiting, moving, inaction
		_target: null, // target from action
		_actionCompleteCallback: null,
		_onTileObj: null, // tile obj of where the player is
		init: function(player, game_context, tile_engine) {
			Player._meta = player;
			Player._gameContext = game_context;
			Player._TileEngine = tile_engine;
			Player._currentAnimation = Player._meta._start_animation;
			
			// get the tile obj
			Player._onTileObj = Player._TileEngine.getTile(Player._meta._start_tile.h, Player._meta._start_tile.v);

			// calculate player's position
			var animation = Player._meta._animations[Player._currentAnimation]; // get the animation data
			Player._position.x = Player._onTileObj._centerPos.x - (animation.width/2);
			Player._position.y = Player._onTileObj._centerPos.y - (animation.height);
		}, 
		render: function(game) {
			var animation = Player._meta._animations[Player._currentAnimation]; // get the animation data
			
			// if its moving, call moving
			if (Player._status == 'moving') { Player.moving(Player._target); } 
			else if (Player._status == 'attacking') { Player.attacking(); }

			// if sequence is greater than cycle length, then reset
			if (Player._sequence >= animation.cycle.length) {
				Player._sequence = 0;
			}
			var cycle = animation.cycle[Player._sequence];
			// draw player
			if (isObjInViewport(game._viewport, Player._position.x, Player._position.y, animation.width, animation.height)) {
				Player._gameContext.drawImage(Player._meta._imgObj, 
					cycle[0], cycle[1], animation.width, animation.height, 
					Player._position.x - game._viewport.x, Player._position.y - game._viewport.y, 
					animation.width, animation.height);
			}
			
			Player._tickCounter++;
			// check if needs to go to next cycle
			if (Player._tickCounter >= animation.tick_length) {
				Player._sequence++;
				Player._tickCounter = 0; // reset tick counter;
			}
		},
		// initiate moving animation
		moveTile: function(tile, params, callback) {
			// get the animation
			ani = Player._TileEngine.getAnimationDirection(Player._onTileObj, tile);
			Player._currentAnimation = ani;
			Player._sequence = 0;
			
			// set player status to moving
			Player._status = 'moving';
			Player._target = tile;
			Player.moving(Player._target);

			Player._actionCompleteCallback = callback;
		},
		// this will get called until it reaches the target
		moving: function(target) {
			var animation = Player._meta._animations[Player._currentAnimation]; // get the animation data
			var destX = target._centerPos.x - (animation.width/2);
			var destY = target._centerPos.y - (animation.height);

			var xlength = Math.abs((target._centerPos.x - Player._onTileObj._centerPos.x));
			var ylength = Math.abs((target._centerPos.y - Player._onTileObj._centerPos.y));
			if (destX != Player._position.x) {
				if (destX > Player._position.x) {
					Player._position.x += xlength/10;// this is the speed!!!!
				} else if (destX < player._position.x) { 
					Player._position.x -= xlength/10;
				}
			}
			if (destY != Player._position.y) {
				if (destY > Player._position.y) {
					Player._position.y += ylength/10;// this is the speed!!!!
				} else if (destY < Player._position.y) { 
					Player._position.y -= ylength/10;
				}
			}

			// If player reached destination, update the player current tile
			//Message.addMessage('Player('+player.x+':'+player.y+')'+'Destination('+destinationX+':'+destinationY+')', false);
			if (Player._position.x == destX && Player._position.y == destY) {
				Player._position.x = destX;
				Player._position.y = destY;
				Player._onTileObj = target;
				Player._status = 'waiting';
				Player._currentAnimation = 'default'
				Player._actionCompleteCallback();
				Player._actionCompleteCallback = null;
			}
		},
		// initiate attack animation
		attack: function(enemy, params, callback) {
			// get the animation
			Player._currentAnimation = 'attack';
			Player._sequence = 0;
			
			// set player status to moving
			Player._status = 'attacking';
			Player._target = enemy;

			Player._actionCompleteCallback = callback;
		}, 
		attacking: function() {
			var animation = Player._meta._animations[Player._currentAnimation]; // get the animation data
			var len = animation.cycle.length;
			if (Player._sequence >= len-1) {
				Player._status = 'waiting';
				Player._currentAnimation = 'default'
				Player._actionCompleteCallback();
				Player._actionCompleteCallback = null;
			}
		},
		isClicked: function(mouse) {
			var pos = Player._position;
			var animation = Player._meta._animations[Player._currentAnimation]; // get the animation data
			var max_x = pos.x + animation.width;
			var max_y = pos.y + animation.height;
			if (mouse.x >= pos.x && mouse.x <=max_x && mouse.y >= pos.y && mouse.y <= max_y) {
				return this;
			}
			return false;
		}
	}
	return Player;
}
