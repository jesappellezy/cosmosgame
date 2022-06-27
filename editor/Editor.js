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

		this._button = new CharButton(10, 10, "▶", 18, 21, () => {
			this._playStop();
		});
		Interface.Input.buttons = [this._button];
	}

	/**
	 * Appelé à chaque tick
	 */
	tick() {
		var mouseX = Interface.Input.mouseX;
		var mouseY = Interface.Input.mouseY;
		var mouseMoveX = mouseX - this._lastMouseX;
		var mouseMoveY = mouseY - this._lastMouseY;

		Interface.Input.tickButtons();
		if(this._playing)
			this._level.tick();
		else {
			if(!this._cameraMoving && Interface.Input.leftClickPressed) {
				this._cameraMoving = true;
			}
			else {
				if(!Interface.Input.leftClickPressed) {
					this._cameraMoving = false;
				}
				else {
					this._level.cameraX -= mouseMoveX;
					this._level.cameraY -= mouseMoveY;
				}
			}
		}

		this._lastMouseX = mouseX;
		this._lastMouseY = mouseY;
	}

	/**
	 * Appelé à chaque tick pour dessiner l'éditeur
	 */
	draw(ctx) {
		this._level.draw(ctx);
		Interface.Input.drawButtons(ctx);
		if(!this._playing) {
			this._showGrid(ctx);
		}
	}

	_playStop() {
		if(this._playing) {
			this._level.reset();
		}
		this._playing = !this._playing;
		this._button.active = this._playing;
	}

	_showGrid(ctx) {
		var offsetX = -this._level.cameraX;
		var offsetY = -this._level.cameraY;
		var width = Interface.Output.width;
		var height = Interface.Output.height;
		var allX = []

		ctx.fillStyle = EDITOR_GRID_COLOR

		var x = offsetX % EDITOR_GRID_SIZE;
		if(x < 0)
			x += EDITOR_GRID_SIZE;
		for(; x < width + width; x += EDITOR_GRID_SIZE) {
			ctx.fillRect(x, 0, 1, height);
		}

		var y = offsetY % EDITOR_GRID_SIZE;
		if(y < 0)
			y += EDITOR_GRID_SIZE;
		for(; y < width + width; y += EDITOR_GRID_SIZE) {
			ctx.fillRect(0, y, width, 1);
		}
	}
}