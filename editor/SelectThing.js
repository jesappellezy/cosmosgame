/**
 * The thing usually blue which appears when we select something.
 */
class SelectThing {
	/**
	 * obj: Avatar, Array[4] (a collision box) or Array[3] (semi-tangible).
	 *   The selected object.
	 */
	constructor(obj) {
		this._type = obj instanceof Avatar ? "avatar" : (obj.length == 4 ? "collisionbox" : "half-tangible");
		this._obj = obj;
		this._hover = null;
		this._selected = null;
		this._selectedPoint = null;
		this._leftClickPressed = false;

		var w = this._type == "avatar" ? null : this._getW();
		var h = ["avatar", "half-tangible"].indexOf(this._type) != -1 ? null : this._getH();
		this._setDims(this._getX(), this._getY(), w, h);
	}
	tick(cameraX, cameraY, mouseX_canvas, mouseY_canvas) {
		var dims = this._getDimensions(cameraX, cameraY);
		var x_canvas = dims[0];
		var y_canvas = dims[1];
		var w = dims[2];
		var h = dims[3];

		// Cherche sur quoi le pointeur est.
		function isOnPoint(x_canvas, y_canvas) {
			return (
				mouseX_canvas > x_canvas - 2 * EDITOR_SELECT_THING_WIDTH - 10 &&
				mouseX_canvas < x_canvas + 2 * EDITOR_SELECT_THING_WIDTH + 10 &&
				mouseY_canvas > y_canvas - 2 * EDITOR_SELECT_THING_WIDTH - 10 &&
				mouseY_canvas < y_canvas + 2 * EDITOR_SELECT_THING_WIDTH + 10
				);
		}
		function isOnLine(x_canvas, y_canvas, w, isHorizontal) {
			if(isHorizontal)
				return [
					mouseX_canvas >= x_canvas &&
					mouseX_canvas < x_canvas + w &&
					mouseY_canvas > y_canvas - 10 &&
					mouseY_canvas < y_canvas + 10,
					Math.abs(mouseY_canvas - y_canvas)
					];
			else
				return [
					mouseY_canvas >= y_canvas &&
					mouseY_canvas < y_canvas + w &&
					mouseX_canvas > x_canvas - 10 &&
					mouseX_canvas < x_canvas + 10,
					Math.abs(mouseX_canvas - x_canvas)
					];
		}
		var hover = null;
		if(mouseX_canvas >= x_canvas &&
		   mouseX_canvas < x_canvas + w &&
		   mouseY_canvas >= y_canvas &&
		   mouseY_canvas < y_canvas + h
		   ) {
			hover = "all";
		}
		if(this._type == "half-tangible") {
			if(isOnPoint(x_canvas, y_canvas))
				hover = "point1";
			else if(isOnPoint(x_canvas+w, y_canvas))
				hover = "point2";
			else if(isOnLine(x_canvas, y_canvas, w, true)[0])
				hover = "side";
		}
		else if(this._type == "collisionbox") {
			/**
			 * A-B
			 * | |
			 * D-C
			 */
			var distanceToLine = Infinity;
			[
				[x_canvas,   y_canvas,   w, true ],
				[x_canvas,   y_canvas+h, w, true ],
				[x_canvas,   y_canvas,   h, false],
				[x_canvas+w, y_canvas,   h, false]
			].forEach((args, i) => {
				var v = isOnLine(...args);
				if(v[0] && v[1] < distanceToLine) {
					switch(i) {
						case 0: hover = "sideAB"; break;
						case 1: hover = "sideCD"; break;
						case 2: hover = "sideAD"; break;
						case 3: hover = "sideBC"; break;
					}
					distanceToLine = v[1];
				}
			})
		}
		this._hover = hover;

		// Au début du glisser-déplacer
		if(!this._leftClickPressed && Interface.Input.leftClickPressed) {
			this._leftClickPressed = true;
			if(this._selected == null) {
				this._selected = this._hover;
				switch(this._selected) {
					case "point2":
					case "sideBC":
						this._selectedPoint = [mouseX_canvas + cameraX - this._getX() - this._getW(), mouseY_canvas + cameraY - this._getY()]
						break;
					case "sideCD":
						this._selectedPoint = [mouseX_canvas + cameraX - this._getX(), mouseY_canvas + cameraY - this._getY() - this._getH()]
						break;
					default:
						this._selectedPoint = [mouseX_canvas + cameraX - this._getX(), mouseY_canvas + cameraY - this._getY()]
						break;
				}
			}
		}
		// A la fin du glisser-déplacer
		else if(this._leftClickPressed && !Interface.Input.leftClickPressed) {
			this._leftClickPressed = false;
			this._selected = null;
		}

		// Si quelque chose est en cours de déplacement
		if(this._selected != null) {
			switch(this._selected) {
				case "side":
				case "all":
					this._setDims(mouseX_canvas + cameraX - this._selectedPoint[0],
					              mouseY_canvas + cameraY - this._selectedPoint[1]);
					break;
				case "point1":
					this._setDims(mouseX_canvas + cameraX - this._selectedPoint[0],
					              null,
					              this._getX() + this._getW() - mouseX_canvas - cameraX + this._selectedPoint[0],
					              null);
					break;
				case "point2":
					this._setDims(null,
					              null,
					              mouseX_canvas + cameraX - this._getX() - this._selectedPoint[0],
					              null);
					break;
				case "sideAB":
					this._setDims(null,
					              mouseY_canvas + cameraY - this._selectedPoint[1],
					              null,
					              this._getY() + this._getH() - mouseY_canvas - cameraY + this._selectedPoint[1]);
					break;
				case "sideAD":
					this._setDims(mouseX_canvas + cameraX - this._selectedPoint[0],
					              null,
					              this._getX() + this._getW() - mouseX_canvas - cameraX + this._selectedPoint[0],
					              null);
					break;
				case "sideBC":
					this._setDims(null,
					              null,
					              mouseX_canvas + cameraX - this._getX() - this._selectedPoint[0],
					              null);
					break;
				case "sideCD":
					this._setDims(null,
					              null,
					              null,
					              mouseY_canvas + cameraY - this._getY() - this._selectedPoint[1]);
					break;
			}

			Interface.Input.getLeftClick();
		}
	}

	draw(ctx, cameraX, cameraY) {
		var dims = this._getDimensions(cameraX, cameraY);
		var x_canvas = dims[0];
		var y_canvas = dims[1];
		var w = dims[2];
		var h = dims[3];
		var bright = this._selected != null ? this._selected : this._hover;

		// Remplit
		ctx.fillStyle = EDITOR_SELECT_THING_FILL_COLOR;
		ctx.fillRect(x_canvas, y_canvas, w, h);

		// Dessine les lignes et points
		function drawPoint(x_canvas, y_canvas, bright) {
			ctx.fillStyle = bright ? EDITOR_SELECT_THING_SELECTED_COLOR : EDITOR_SELECT_THING_POINT_COLOR;
			ctx.fillRect(x_canvas - 2*EDITOR_SELECT_THING_WIDTH, y_canvas - 2*EDITOR_SELECT_THING_WIDTH, 4*EDITOR_SELECT_THING_WIDTH, 4*EDITOR_SELECT_THING_WIDTH)
		}
		function drawLine(x_canvas, y_canvas, x2_canvas, y2_canvas, bright) {
			ctx.lineWidth = EDITOR_SELECT_THING_WIDTH;
			ctx.strokeStyle = bright ? EDITOR_SELECT_THING_SELECTED_COLOR : EDITOR_SELECT_THING_COLOR;
			ctx.beginPath();
			ctx.moveTo(x_canvas, y_canvas);
			ctx.lineTo(x2_canvas, y2_canvas);
			ctx.stroke();
		}
		if(this._type == "half-tangible") {
			drawLine(x_canvas, y_canvas, x_canvas+w, y_canvas, bright == "side");
			drawPoint(x_canvas, y_canvas, bright == "point1");
			drawPoint(x_canvas+w, y_canvas, bright == "point2");
		}
		else {
			ctx.lineWidth = EDITOR_SELECT_THING_WIDTH;
			ctx.strokeStyle = EDITOR_SELECT_THING_COLOR;
			ctx.strokeRect(x_canvas, y_canvas, w, h);

			switch(bright) {
				case "sideAB": drawLine(x_canvas,   y_canvas,   x_canvas+w, y_canvas,   true); break;
				case "sideCD": drawLine(x_canvas,   y_canvas+h, x_canvas+w, y_canvas+h, true); break;
				case "sideAD": drawLine(x_canvas,   y_canvas,   x_canvas,   y_canvas+h, true); break;
				case "sideBC": drawLine(x_canvas+w, y_canvas,   x_canvas+w, y_canvas+h, true); break;
			}
		}
	}

	_getDimensions(cameraX, cameraY) {
		var obj = this._obj;
		var x = this._getX();
		var y = this._getY();
		var w = this._getW();
		var h = this._getH();
		x -= cameraX;
		y -= cameraY;
		return [x, y, w, h];
	}

	_setDims(x, y, w = null, h = null) {
		if(x != null) x = Math.round(x / EDITOR_PRECISION) * EDITOR_PRECISION;
		if(y != null) y = Math.round(y / EDITOR_PRECISION) * EDITOR_PRECISION;
		if(w != null) w = Math.round(w / EDITOR_PRECISION) * EDITOR_PRECISION;
		if(h != null) h = Math.round(h / EDITOR_PRECISION) * EDITOR_PRECISION;

		if(w != null) {
			if(w < EDITOR_PRECISION) {
				if(x != null) {
					x += w - EDITOR_PRECISION;
				}
				w = EDITOR_PRECISION;
			}
		}
		if(h != null) {
			if(h < EDITOR_PRECISION) {
				if(y != null) {
					y += h - EDITOR_PRECISION;
				}
				h = EDITOR_PRECISION;
			}
		}

		if(x != null) this._setX(x);
		if(y != null) this._setY(y);
		if(w != null) this._setW(w);
		if(h != null) this._setH(h);
	}

	_getX() {
		return this._type == "avatar" ? this._obj.x : this._obj[0];
	}
	_getY() {
		return this._type == "avatar" ? this._obj.y : this._obj[1];
	}
	_getW() {
		return this._type == "avatar" ? AVATAR_WIDTH : this._obj[2];
	}
	_getH() {
		return this._type == "avatar" ? AVATAR_HEIGHT : (this._type == "half-tangible" ? HALF_TANGIBLE_HEIGHT : this._obj[3]);
	}
	_setX(value) {
		if(this._type == "avatar") { this._obj.x = value;
		                             this._obj.level._baseX = value; }
		else                       this._obj[0] = value;
	}
	_setY(value) {
		if(this._type == "avatar") { this._obj.y = value;
		                             this._obj.level._baseY = value; }
		else                       this._obj[1] = value;
	}
	_setW(value) {
		if(this._type == "avatar") throw "Can't be called with avatar object.";
		else                       this._obj[2] = value;
	}
	_setH(value) {
		if(this._type == "avatar")             throw "Can't be called with avatar object.";
		else if(this._type == "half-tangible") throw "Can't be called with half-tangible collision.";
		else                                   this._obj[3] = value;
	}
}