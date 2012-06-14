var createTile = function() {
	var Tile = {
		_dimension: {width: 0, height: 0},
		_pos: {x: 0, y: 0},
		_centerPos: {x: 0, y: 0},
		_worldIndex: {h: 0, v:0},
		_zIndex: 0,
		_isBlock: false,
		_imgObj: null,
		_MovableMode: false,
		_offset: {x: 0, y:0},
		_map: null,
		init: function(tile, position, dimension, worldIndex) {
			Tile._isBlock = tile._isBlock;
			Tile._imgObj = tile._imgObj;
			Tile._pos = position;
			Tile._dimension = dimension;
			Tile._worldIndex = worldIndex;
			Tile._zIndex = worldIndex.h + worldIndex.v;
			Tile._map = tile._map;
			Tile._offset = {x: tile._map.normal.x, y: tile._map.normal.y};
			//Message.addMessage('Pos: '+position.x+':'+position.y);
			//Message.addMessage('Dim: '+dimension.width+':'+dimension.height);

			Tile._centerPos.x = Tile._pos.x + (Tile._dimension.width/2);
			Tile._centerPos.y = Tile._pos.y + (Tile._dimension.height/2);
		},
		toggleMovable: function(flag) {
			Tile._movableMode = flag;
			if (flag) {
				Tile._offset.x = Tile._map.movable.x, 
				Tile._offset.y = Tile._map.movable.y;
			} else {
				Tile._offset.x = Tile._map.normal.x, 
				Tile._offset.y = Tile._map.normal.y;
			}
		}
	}
	return Tile;
}

var TileEngine = {
	_tiles: null, // tiles[h][v]
	_tilesZOrder: null, // ordered tiles by z-index
	init: function(world) {
		TileEngine._tiles = new Array();
		TileEngine._tilesZOrder = new Array();

		// create the tiles
		var lenH = world._tiles.length;
		for (h = 0; h < lenH; h++) {
			var lenV = world._tiles[h].length; 
			TileEngine._tiles[h] = new Array();
			for (v = 0; v < lenV; v++) {
				var tileObj = createTile();
				var index = {h: h, v: v};
				var dimension = {width: world._tileDimension.width, height: world._tileDimension.height};
				// if tile has custom height
				if (world._tiles[h][v]._height != world._tileDimension.height) {dimension.height = world._tiles[h][v]._height;}
				var pos = {};
				// calculate position
				pos.x = world._startPos.x - (h * (world._tileDimension.width/2)) + (v * (world._tileDimension.width/2));
				pos.y = world._startPos.y + (h * (world._tileDimension.height/2)) + (v * (world._tileDimension.height/2));
				// if tile has custom height, adjust y
				if (world._tiles[h][v]._height != world._tileDimension.height) {
					pos.y = pos.y - (dimension.height - world._tileDimension.height);	
				}

				tileObj.init(world._tiles[h][v], pos, dimension, index);
				TileEngine._tiles[h][v] = tileObj;

				//put in tiles order
				if (!(TileEngine._tilesZOrder[tileObj._zIndex] instanceof Array)) {
					TileEngine._tilesZOrder[tileObj._zIndex] = new Array();
				}
				TileEngine._tilesZOrder[tileObj._zIndex].push(tileObj);
			}
		}
	},
	getTile: function(h,v) {
		return TileEngine._tiles[h][v]; 
	},
	showMovableTiles: function(player, range) {
		TileEngine.clearMovableTiles(); //clear first

		tile = player._onTileObj; //get current tile
		start_h = tile._worldIndex.h - range;
		start_h = (start_h >= 0) ? start_h : 0;
		end_h = tile._worldIndex.h + range;
		end_h = (end_h < TileEngine._tiles.length) ? end_h : (TileEngine._tiles.length-1);
		start_v = tile._worldIndex.v - range;
		start_v = (start_v >= 0) ? start_v : 0;
		end_v = tile._worldIndex.v + range;

		for (h = start_h; h <= end_h; h++) {
			for (v = start_v; v <= end_v; v++) {
				temp = TileEngine._tiles[h][v];
				if (temp == undefined) {
					continue;
				} else {
					if (!temp._isBlock && 
							!(temp._worldIndex.h == tile._worldIndex.h && temp._worldIndex.v == tile._worldIndex.v)) {
						temp.toggleMovable(true);
					}
				}
			}
		}
	},
	clearMovableTiles: function() {
		var lenH = TileEngine._tiles.length;
		for (h = 0; h < lenH; h++) {
			var lenV = TileEngine._tiles[h].length; 
			for (v = 0; v < lenV; v++) {
				var temp = TileEngine._tiles[h][v];
				temp.toggleMovable(false);
			}
		}
	},
	getMovableTile: function(mouse, player, range) {
		tile = player._onTileObj; //get current tile
		start_h = tile._worldIndex.h - range;
		start_h = (start_h >= 0) ? start_h : 0;
		end_h = tile._worldIndex.h + range;
		end_h = (end_h < TileEngine._tiles.length) ? end_h : (TileEngine._tiles.length-1);
		start_v = tile._worldIndex.v - range;
		start_v = (start_v >= 0) ? start_v : 0;
		end_v = tile._worldIndex.v + range;

		for (h = start_h; h <= end_h; h++) {
			for (v = start_v; v <= end_v; v++) {
				var temp = TileEngine._tiles[h][v];
				if (temp == undefined) {
					continue;
				} else {
					var max_x = temp._pos.x + temp._dimension.width;
					var min_x = temp._pos.x;
					var max_y = temp._pos.y + temp._dimension.height;
					var min_y = temp._pos.y;
					var poly = [
						{x: max_x, y: temp._centerPos.y},
						{x: min_x, y: temp._centerPos.y},
						{x: temp._centerPos.x, y: max_y},
						{x: temp._centerPos.x, y: min_y}
					];
					if (!temp._isBlock && 
							!(temp._worldIndex.h == tile._worldIndex.h && temp._worldIndex.v == tile._worldIndex.v) &&
							isPointInPoly(poly, mouse)) {
						//Message.addMessage(JSON.stringify(temp._worldIndex));
						//TileEngine.clearMovableTiles(); //clear first
						return temp;
					}
				}
			}
		}

		return false;
	},
	getAnimationDirection: function(current, next) {
		//Message.addMessage(JSON.stringify(next._worldIndex) +''+ JSON.stringify(current._worldIndex));
		if (next._worldIndex.v > current._worldIndex.v) {
			return "walk-east";
		} else if (next._worldIndex.v < current._worldIndex.v) {
			return "walk-west";
		} else {
			if (next._worldIndex.h < current._worldIndex.h) {
				return "walk-north";
			} else if (next._worldIndex.h > current._worldIndex.h) {
				return "walk-south";
			} else {
				return "default";
			}
		}
	}
}
