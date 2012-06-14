/*All code copyright 2010 by John Graham unless otherwise attributed*/

var Message = { //object to create messages (using alert in a game loop will crash your browser)
	message: 0, //hold element where messages will be added
	init: function(){
		Message.message = document.getElementById('message');
	},
	addMessage: function(msg, newline){ //add new message
		if(Message.message){
			if (newline != null && newline == false) {
				msg = '- '+msg+'';
				Message.message.innerHTML = msg;
			} else {
				msg = '- '+msg+'<br />';
				Message.message.innerHTML += msg;
			}
		}
	}
};

var FPS = {
	fps: 0, //hold element to display fps
	fps_count: 0, //hold frame count
	fps_timer: 0, //timer for FPS update (2 sec)
	init: function(){
		FPS.fps = document.getElementById('fps');
		FPS.fps_timer = setInterval(FPS.updateFPS, 2000);
	},
	updateFPS: function(){ //add new message
		if(FPS.fps){
			FPS.fps.innerHTML = '<b>FPS</b>: '+(FPS.fps_count / 2) + 'fps';
		}
		FPS.fps_count = 0;
	}
};

var Mouse = {
	mouse: null,
	init: function(){
		FPS.mouse = document.getElementById('mouse_pos');
		FPS.fps_timer = setInterval(FPS.updateMouse, 2000);
	},
	updateMouse: function(){ //add new message
		mouse = KINETIC_STAGE.getMousePos();
		if(FPS.mouse){
			FPS.mouse.innerHTML = mouse.x+':'+mouse.y;
		}
	}
};

Message.init();
FPS.init();
