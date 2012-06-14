var tile = {
	_src: 'images/tile.png',
	_imgObj: null,
	_isBlock: true,
	_map: {
		normal: {x: 0, y:0},
		movable: {x: 0, y:0},
	},
	_height: 50
};
var block = {
	_src: 'images/block.png',
	_imgObj: null,
	_isBlock: true,
	_map: {
		normal: {x: 0, y:0},
		movable: {x: 0, y:0},
	},
	_height: 50
};
var tower = {
	_src: 'images/tile-tower.png',
	_imgObj: null,
	_isBlock: true,
	_map: {
		normal: {x: 0, y:0},
		movable: {x: 0, y:0},
	},
	_height: 115
};
var empty = {
	_src: '',
	_imgObj: null,
	_isBlock: true,
	_map: {
		normal: {x: 0, y:0},
		movable: {x: 0, y:0},
	},
	_height: 50
};
var grass = {
	_src: 'images/tile5.png',
	_imgObj: null,
	_isBlock: false,
	_map: {
		normal: {x: 0, y:0},
		movable: {x: 0, y:50},
	},
	_height: 50
};
var WORLD = {
	_tiles: [[empty,empty,empty,empty,tower,tower,tower,tower],
					 [empty,empty,empty,empty,tower,grass,grass,tile],
					 [tower,tower,tower,tower,tower,grass,grass,tile,tile,tile],
					 [tower,grass,grass,grass,grass,grass,grass,grass,grass,tile],
					 [tower,grass,tower,grass,grass,grass,grass,grass,grass,tile],
					 [tower,grass,grass,grass,grass,grass,grass,grass,grass,tile],
					 [tower,grass,grass,grass,tile,tile,tile,tile,tile,tile],
					 [tower,tile,tile,tile,tile]],
	_tileDimension: {width: 100, height: 50},
	_src: 'images/background.jpg', 
	_imgObj: null, //for background
	_startPos: {x: 350, y: 100},
	_size: {width: 800, height: 600}
}

var MOUSE = {
	x: 0,
	y: 0
}

var animationArr = new Array();
animationArr['default'] = {
	cycle: [[0,0]],
	width: 40,
	height: 70,
	tick_length: 10};
animationArr['attack'] = {
	cycle: [[0,150],[60,150],[120,150],[180,150],[240,150]],
	width: 60,
	height: 100,
	tick_length: 4};
animationArr['walk-south'] = {
	cycle: [[601,80],[561,80],[521,80],[481,80],[441,80],[401,80],[361,80],[321,80]],
	width: 40,
	height: 70,
	tick_length: 4};
animationArr['walk-west'] = {
	cycle: [[321,0],[361,0],[401,0],[441,0],[481,0],[521,0],[561,0],[601,0]],
	width: 40,
	height: 70,
	tick_length: 4};
animationArr['walk-north'] = {
	cycle: [[281,80],[241,80],[201,80],[161,80],[121,80],[81,80],[41,80],[0,80]],
	width: 40,
	height: 70,
	tick_length: 4};
animationArr['walk-east'] = {
	cycle: [[0,0],[41,0],[81,0],[121,0],[161,0],[201,0],[241,0],[281,0]],
	width: 40,
	height: 70,
	tick_length: 4};

var animationArr2 = new Array();
animationArr2['default'] = {
	cycle: [[32,0]],
	width: 32,
	height: 62,
	tick_length: 10};
animationArr2['attack'] = {
	cycle: [[32,0],[32,0],[32,0],[32,0],[32,0]],
	width: 32,
	height: 62,
	tick_length: 10};
animationArr2['walk-south'] = {
	cycle: [[32,0],[64,0],[96,0],[64,0],[32,0],[128,0],[160,0],[128,0]],
	width: 32,
	height: 62,
	tick_length: 4};
animationArr2['walk-west'] = {
	cycle: [[32,62],[64,62],[96,62],[64,62],[32,62],[128,62],[160,62],[128,62]],
	width: 32,
	height: 62,
	tick_length: 4};
animationArr2['walk-north'] = {
	cycle: [[32,124],[64,124],[96,124],[64,124],[32,124],[128,124],[160,124],[128,124]],
	width: 32,
	height: 62,
	tick_length: 4};
animationArr2['walk-east'] = {
	cycle: [[32,189],[64,189],[96,189],[64,189],[32,189],[128,189],[160,189],[128,189]],
	width: 32,
	height: 62,
	tick_length: 4};

var actions = {
	move: {action_id: 1}, //move
	attack: {action_id: 2}, //attack
	defend: {action_id: 3}, //defend
	magic: [{action_id: 1001},{action_id: 1002}], //magic
	skills: [{action_id: 4001},{action_id: 4002}], //skills
	items: [{action_id: 7001},{action_id: 7002}], //items
};

var PLAYER1_META = {
	_username: 'aluksidadi',
	_src: 'images/character2.png',
	_imgObj: null,
	_animations: animationArr,
	_start_tile: {h: 3, v: 1},
	_start_animation: 'default',
	_session_id: '1234567890',
	_meter: 0,
	_hp: 500,
	_lastMoveID: 0,
	_actions: actions
};
var PLAYER2_META = {
	_username: 'bzhou',
	_src: 'images/character.png',
	_imgObj: null,
	_animations: animationArr2,
	_start_tile: {h: 1, v: 6},
	_start_animation: 'default',
	_session_id: '0987654321',
	_meter: 0,
	_hp: 500,
	_lastMoveID: 0
}
var PLAYER3_META = {
	_username: 'xyz',
	_src: 'images/character.png',
	_imgObj: null,
	_animations: animationArr2,
	_start_tile: {h: 2, v: 6},
	_start_animation: 'default',
	_session_id: '0987654322',
	_meter: 0,
	_hp: 500,
	_lastMoveID: 0
}

var ASSETS = [tile,block,tower,empty,grass,WORLD,PLAYER1_META,PLAYER2_META,PLAYER3_META];
