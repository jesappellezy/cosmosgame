"use strict";

/**
 * Editeur de niveau.
 */
class Editor {
	/**
	 * level: Level à éditer
	 */
	constructor(level) {
		this._level = level;
		this._playing = false;
		this._cameraMoving = false;

		this._lastMouseX = Interface.Input.mouseX;
		this._lastMouseY = Interface.Input.mouseY;

		this._buttonPlay = new CharButton(40, 40, "▶", 72, 84, () => {
			this._playStop();
		});

		this._buttonMove = new CharButton(80 + EDITOR_BUTTON_SIZE, 40, "m", 72, 80, () => {
			this._changeMode("move");
		}, true);

		this._buttonCollisions = new CharButton(120 + 2 * EDITOR_BUTTON_SIZE, 40, "c", 72, 80, () => {
			this._changeMode("collisions");
		});

		this._mode = "move";

		this._syncButtons();

		this._selectThing = null;
	}

	/**
	 * Appelé à chaque tick
	 */
	tick() {
		var camera = this._level.getCameraTopLeft()
		var cameraX = camera[0];
		var cameraY = camera[1];
		var mouseX_canvas = Interface.Input.mouseX;
		var mouseY_canvas = Interface.Input.mouseY;
		var mouseMoveX_canvas = mouseX_canvas - this._lastMouseX;
		var mouseMoveY_canvas = mouseY_canvas - this._lastMouseY;

		Interface.Input.tickButtons();
		if(this._playing)
			this._level.tick();
		else {
			if(this._mode == "move") {
				if(!this._cameraMoving && Interface.Input.leftClickPressed) {
					this._cameraMoving = true;
				}
				else {
					if(!Interface.Input.leftClickPressed) {
						this._cameraMoving = false;
					}
					else {
						this._level.cameraX -= mouseMoveX_canvas;
						this._level.cameraY -= mouseMoveY_canvas;
					}
				}
			}
			else if(this._mode == "collisions") {
				if(this._selectThing != null)
					this._selectThing.tick(cameraX, cameraY, mouseX_canvas, mouseY_canvas, mouseMoveX_canvas, mouseMoveY_canvas);

				if(this._isMouseOn(mouseX_canvas, mouseY_canvas, [this._level.avatar.x, this._level.avatar.y, AVATAR_WIDTH, AVATAR_HEIGHT]) && Interface.Input.getLeftClick()) {
					this._selectThing = new SelectThing(this._level.avatar);
				}
				this._level.collision.getCollisionBoxes().forEach((box) => {
					if(this._isMouseOn(mouseX_canvas, mouseY_canvas, box) && Interface.Input.getLeftClick()) {
						this._selectThing = new SelectThing(box);
					}
				})
				this._level.collision.getHalfTangibles().forEach((ht) => {
					if(this._isMouseOn(mouseX_canvas, mouseY_canvas, [...ht, HALF_TANGIBLE_HEIGHT]) && Interface.Input.getLeftClick()) {
						this._selectThing = new SelectThing(ht);
					}
				})
			}
		}

		this._lastMouseX = mouseX_canvas;
		this._lastMouseY = mouseY_canvas;
	}

	/**
	 * Appelé à chaque tick pour dessiner l'éditeur
	 */
	draw(ctx) {
		var mouseX_canvas = Interface.Input.mouseX;
		var mouseY_canvas = Interface.Input.mouseY;

		this._level.draw(ctx);
		if(!this._playing) {
			this._showGrid(ctx);
			if(this._selectThing != null) {
				var camera = this._level.getCameraTopLeft();
				this._selectThing.draw(ctx, camera[0], camera[1]);
			}
		}
		Interface.Input.drawButtons(ctx);
	}

	_playStop() {
		this._selectThing = null;
		if(this._playing) {
			this._level.reset();
		}
		this._playing = !this._playing;
		this._buttonPlay.active = this._playing;
		this._syncButtons();
	}

	_showGrid(ctx) {
		var offsetX = -this._level.cameraX;
		var offsetY = -this._level.cameraY;
		var width = CANVAS_WIDTH;
		var height = CANVAS_HEIGHT;
		var allX = []

		var gridWidth = CANVAS_WIDTH / Interface.Output.CANVAS.offsetWidth;

		ctx.fillStyle = EDITOR_GRID_COLOR

		var x = offsetX % EDITOR_GRID_SIZE;
		if(x < 0)
			x += EDITOR_GRID_SIZE;
		for(; x < width + width; x += EDITOR_GRID_SIZE) {
			ctx.fillRect(x, 0, gridWidth, height);
		}

		var y = offsetY % EDITOR_GRID_SIZE;
		if(y < 0)
			y += EDITOR_GRID_SIZE;
		for(; y < width + width; y += EDITOR_GRID_SIZE) {
			ctx.fillRect(0, y, width, gridWidth);
		}

		// Afficher l'échelle
		ctx.lineWidth = gridWidth * 2;
		ctx.strokeStyle = EDITOR_SCALE_COLOR;
		ctx.beginPath();
		var x = CANVAS_WIDTH - EDITOR_GRID_SIZE * 2;
		var y = CANVAS_HEIGHT - EDITOR_GRID_SIZE * 1.5;
		ctx.moveTo(x, y);
		ctx.lineTo(x - EDITOR_GRID_SIZE * 2, y);
		ctx.moveTo(x, y - 10);
		ctx.lineTo(x, y + 10);
		ctx.moveTo(x - EDITOR_GRID_SIZE * 2, y - 10);
		ctx.lineTo(x - EDITOR_GRID_SIZE * 2, y + 10);
		ctx.stroke();
		ctx.textAlign = "center";
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 40px sans-serif";
		ctx.fillText(String(EDITOR_GRID_SIZE * 2) + "px", x - EDITOR_GRID_SIZE, y - 20);
	}

	_changeMode(value) {
		this._selectThing = null;
		this._mode = value;
		[this._buttonMove, this._buttonCollisions].forEach((button) => {
			button.active = false;
		});
		switch(value) {
			case "move":
				this._buttonMove.active = true;
				break;
			case "collisions":
				this._buttonCollisions.active = true;
				break
			default:
				throw "value must be 'move' or 'select'."
		}
	}

	_syncButtons() {
		if(this._playing) {
			Interface.Input.buttons = [this._buttonPlay];
		}
		else {
			Interface.Input.buttons = [this._buttonPlay, this._buttonMove, this._buttonCollisions];
		}
	}

	_isMouseOn(mouseX, mouseY, box) {
		var offset = this._level.getCameraTopLeft();
		return (
			mouseX >= box[0] - offset[0] &&
			mouseY >= box[1] - offset[1] &&
			mouseX < box[0] + box[2] - offset[0] &&
			mouseY < box[1] + box[3] - offset[1]
			);
	}
}
