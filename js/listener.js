$(document).ready(function() {
	
	$(document).keyup(function(e) {
		switch (e.keyCode)  {
			case 40: //down
				if (VIEWPORT.y < WORLD._size.height)
					VIEWPORT.y += 10;
				Game.updateViewport(VIEWPORT);
			break;
			case 39: //right
				if (VIEWPORT.x < WORLD._size.width)
					VIEWPORT.x += 10;
				Game.updateViewport(VIEWPORT);
			break;
			case 38: //up
				if (VIEWPORT.y > 0)
					VIEWPORT.y -= 10;
				Game.updateViewport(VIEWPORT);
			break;
			case 37: //left
				if (VIEWPORT.x > 0)
					VIEWPORT.x -= 10;
				Game.updateViewport(VIEWPORT);
			break;
			case 27: //esc
				Game.pause();
			break;
			case 13: //enter
				Game.start();
			break;
			case 32: //space
			break;
		}
	});

	$('#game-layer').mousemove(function(e) {
		mouse = getMousePos(this, e);
		$('#mouse_pos').html("<b>Mouse Position</b>: "+mouse.x+":"+mouse.y);
		MOUSE.x = mouse.x;
		MOUSE.y = mouse.y;
	});


	$('#game-layer').click(function(e) {
		Game.captureClick(MOUSE);
	});
});

var getMousePos = function(canvas, evt) {
	var obj = canvas;
	var top = 0;
	var left = 0;
	while (obj.tagName != 'BODY') {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
	}

	// return relative mouse position
	var mouseX = evt.clientX - left + window.pageXOffset + VIEWPORT.x;
	var mouseY = evt.clientY - top + window.pageYOffset + VIEWPORT.y;
	return {
			x: mouseX,
			y: mouseY
	};
}

var updateViewport = function(action) {
	switch (action)  {
		case 'down': //down
			if (VIEWPORT.y < WORLD._size.height)
				VIEWPORT.y = ((VIEWPORT.y + 150) > WORLD._size.width) ? WORLD._size.width : VIEWPORT.y + 150;
			Game.updateViewport(VIEWPORT);
		break;
		case 'right': //right
			if (VIEWPORT.x < WORLD._size.width)
				VIEWPORT.x = ((VIEWPORT.x + 150) > WORLD._size.width) ? WORLD._size.width : VIEWPORT.x + 150;
			Game.updateViewport(VIEWPORT);
		break;
		case 'up': //up
			if (VIEWPORT.y > 0)
				VIEWPORT.y = ((VIEWPORT.y - 150) < 0) ? 0 : VIEWPORT.y - 150;
			Game.updateViewport(VIEWPORT);
		break;
		case 'left': //left
			if (VIEWPORT.x > 0)
				VIEWPORT.x = ((VIEWPORT.x - 150) < 0) ? 0 : VIEWPORT.x - 150;
			Game.updateViewport(VIEWPORT);
		break;
	}
}

var centerViewport = function(x, y) {
	var desired_x = ((x - 200) > 0) ? (x - 200) : 0;
	var desired_y = ((y - 200) > 0) ? (y - 200) : 0;
	var x_timer = setInterval(function() {
		if (VIEWPORT.x < desired_x)
			VIEWPORT.x = ((VIEWPORT.x + 2) > desired_x) ? desired_x : (VIEWPORT.x + 2);
		else 
			VIEWPORT.x = ((VIEWPORT.x - 2) > desired_x) ? desired_x : (VIEWPORT.x - 2);
		Game.updateViewport(VIEWPORT);
		if (VIEWPORT.x == desired_x) {
			clearInterval(x_timer);
		}
	}, 1);

	var y_timer = setInterval(function() {
		if (VIEWPORT.y < desired_y)
			VIEWPORT.y = ((VIEWPORT.y + 2) > desired_y) ? desired_y : (VIEWPORT.y + 2);
		else 
			VIEWPORT.y = ((VIEWPORT.y - 2) > desired_y) ? desired_y : (VIEWPORT.y - 2);
		Game.updateViewport(VIEWPORT);
		if (VIEWPORT.y == desired_y) {
			clearInterval(y_timer);
		}
	}, 1);

	Game.updateViewport(VIEWPORT);
}
