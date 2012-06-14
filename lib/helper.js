// Canvas Helper 
var CanvasHelper = {
	_compatible: false,
	_assets: [],
	_totalAssets: 0,
	_totalLoadedAssets: 0,
	_assetsLoaded: false,
	isCompatible: function() {
		try {
			CanvasHelper._compatible = !!(document.createElement('canvas').getContext('2d')); // S60
			} catch(e) {
			CanvasHelper._compatible = !!(document.createElement('canvas').getContext); // IE
		} 
		return CanvasHelper._compatible;
	},
	loadAssets: function(assets, callback) {
		CanvasHelper._totalAssets = assets.length;
		for(i = 0;  i < this._totalAssets; i++) {
			if (assets[i]._src != '') {
				assets[i]._imgObj = new Image();
				assets[i]._imgObj.onload = function() {
					if (++CanvasHelper._totalLoadedAssets >= CanvasHelper._totalAssets) {
						CanvasHelper._assetsLoaded = true;
					}
					callback(CanvasHelper._totalLoadedAssets/CanvasHelper._totalAssets);
				}
				assets[i]._imgObj.src = assets[i]._src;
				Message.addMessage(assets[i]._src);
			} else {
				if (++CanvasHelper._totalLoadedAssets >= CanvasHelper._totalAssets) {
					CanvasHelper._assetsLoaded = true;
				}
				callback(CanvasHelper._totalLoadedAssets/CanvasHelper._totalAssets);
			}
		}
	}
} 

function pnpoly( nvert, vertx, verty, testx, testy ) {
	var i, j, c = false;
	for( i = 0, j = nvert-1; i < nvert; j = i++ ) {
			if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
					( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
							c = !c;
			}
	}
	return c;
}

function isPointInPoly(poly, pt){
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
		&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
		&& (c = !c);
	return c;
}

function isObjInViewport(viewport, x, y, width, height) {
	if ((x >= viewport.x && x <= (viewport.x + viewport.width) && 
		y >= viewport.y && y <= (viewport.y + viewport.height)) ||

	   ((x+width) >= viewport.x && (x+width) <= (viewport.x + viewport.width) && 
		(y) >= viewport.y && (y) <= (viewport.y + viewport.height)) ||

	   ((x) >= viewport.x && (x) <= (viewport.x + viewport.width) && 
		(y+height) >= viewport.y && (y+height) <= (viewport.y + viewport.height)) ||

	   ((x+width) >= viewport.x && (x+width) <= (viewport.x + viewport.width) && 
		(y+height) >= viewport.y && (y+height) <= (viewport.y + viewport.height))) {
		return true;
	}
	return false;
}
