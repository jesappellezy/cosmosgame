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

		// PLAY BUTTON
		this._buttonPlay = new CharButton(40, 40, "▶", 72, 84, () => {
			this._playStop();
		});

		this._buttonShowCollisions = new CharButton(80 + EDITOR_BUTTON_SIZE, 40, "c", 72, 80, () => {
			this._switchShowCollisionsWhilePlaying();
		}, this._level.showCollisions);

		// MODE BUTTONS
		this._buttonCollisions = new CharButton(80 + EDITOR_BUTTON_SIZE, 40, "c", 72, 80, () => {
			this._changeMode("collisions");
		}, true);
		this._buttonTextures = new CharButton(120 + 2*EDITOR_BUTTON_SIZE, 40, "tx", 72, 80, () => {
			this._changeMode("textures");
		});

		// COLLISION MODE BUTTONS
		this._buttonCreateCollisionBox = new CharButton(40, CANVAS_HEIGHT - EDITOR_BUTTON_SIZE - 40, "□", 100, 84, () => {
			this._create("collisionbox");
		});
		this._buttonCreateHalfTangible = new CharButton(80 + EDITOR_BUTTON_SIZE, CANVAS_HEIGHT - EDITOR_BUTTON_SIZE - 40, "_", 72, 70, () => {
			this._create("half-tangible");
		});

		// TEXTURE MODE BUTTON
		this._buttonCreateTexture = new CharButton(40, CANVAS_HEIGHT - EDITOR_BUTTON_SIZE - 40, "+", 100, 94, () => {
			this._create("texture");
		});

		// REMOVE BUTTON
		this._buttonRemoveSelected = new CharButton(40, CANVAS_HEIGHT - EDITOR_BUTTON_SIZE * 2 - 80, "x", 80, 80, () => {
			switch(this.getSelectThing()._type) {
				case "collisionbox":
					var i = this._level.collision.collisionBoxes.indexOf(this.getSelectThing()._obj);
					this._level.collision.collisionBoxes.splice(i, 1);
					break;
				case "half-tangible":
					var i = this._level.collision.halfTangibles.indexOf(this.getSelectThing()._obj);
					this._level.collision.halfTangibles.splice(i, 1);
					break;
				case "texture":
					var i = this._level.textures.texs.indexOf(this.getSelectThing()._obj);
					this._level.textures.texs.splice(i, 1);
					break;
			}
			this.unsetSelectThing();
		});

		// LOAD/SAVE BUTTONS
		this._buttonLoad = new CharButton(CANVAS_WIDTH - EDITOR_BUTTON_SIZE * 2 - 80, 40, "\u{1f4c2}", 72, 86, () => {
			if(confirm("Charger un autre niveau ? Ce niveau sera perdu s'il n'a pas été sauvegardé.")) LoadSaveLevel.loadFromFile((level) => {
				tickObject = new Editor(level);
			});
		});
		this._buttonSave = new CharButton(CANVAS_WIDTH - EDITOR_BUTTON_SIZE - 40, 40, "\u{1f4be}", 72, 86, () => {
			if(confirm("Sauvegarder le niveau dans un fichier ?")) LoadSaveLevel.saveInFile(this._level);
		});

		this._mode = "collisions";

		this._syncButtons();

		this.unsetSelectThing();
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

		if(!this._cameraMoving && Interface.Input.rightClickPressed) {
			this._cameraMoving = true;
		}
		else {
			if(!Interface.Input.rightClickPressed) {
				this._cameraMoving = false;
			}
			else {
				this._level.cameraX -= mouseMoveX_canvas;
				this._level.cameraY -= mouseMoveY_canvas;
			}
		}

		if(this._playing)
			this._level.tick();
		else {
			if(this.getSelectThing() != null)
				this.getSelectThing().tick(cameraX, cameraY, mouseX_canvas, mouseY_canvas, mouseMoveX_canvas, mouseMoveY_canvas);

			if(this._isMouseOn(mouseX_canvas, mouseY_canvas, [this._level.avatar.x, this._level.avatar.y, AVATAR_WIDTH, AVATAR_HEIGHT]) && Interface.Input.getLeftClick()) {
				this.setSelectThing(new SelectThing(this._level.avatar));
			}
			switch(this._mode) {
				case "collisions":
					this._level.collision.getCollisionBoxes().forEach((box) => {
						if(this._isMouseOn(mouseX_canvas, mouseY_canvas, box) && Interface.Input.getLeftClick()) {
							this.setSelectThing(new SelectThing(box));
						}
					});
					this._level.collision.getHalfTangibles().forEach((ht) => {
						if(this._isMouseOn(mouseX_canvas, mouseY_canvas, [...ht, HALF_TANGIBLE_HEIGHT]) && Interface.Input.getLeftClick()) {
							this.setSelectThing(new SelectThing(ht));
						}
					});
					break;
				case "textures":
					this._level.textures.texs.forEach((tx) => {
						if(this._isMouseOn(mouseX_canvas, mouseY_canvas, [tx.x, tx.y, tx.width, tx.height]) && Interface.Input.getLeftClick()) {
							this.setSelectThing(new SelectThing(tx));
						}
					});
					break;
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
			if(this.getSelectThing() != null) {
				var camera = this._level.getCameraTopLeft();
				this.getSelectThing().draw(ctx, camera[0], camera[1]);
			}
		}
		Interface.Input.drawButtons(ctx);
	}

	_playStop() {
		this.unsetSelectThing();
		if(this._playing) {
			this._level.reset();
		}
		else {
			this._level.setShowCollisions(this._level.showCollisions);
			this._buttonShowCollisions.active = this._level.showCollisions;
		}
		this._playing = !this._playing;
		this._buttonPlay.active = this._playing;
		this._syncButtons();
		this._changeMode(this._mode);
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
		ctx.font = "bolder 40px sans-serif";
		ctx.fillText(String(EDITOR_GRID_SIZE * 2) + "px", x - EDITOR_GRID_SIZE, y - 20);
	}

	_changeMode(value) {
		this.unsetSelectThing();
		this._mode = value;
		[this._buttonCollisions, this._buttonTextures].forEach((button) => {
			button.active = false;
		});
		switch(value) {
			case "collisions":
				this._level.setShowCollisions(true);
				this._buttonCollisions.active = true;
				break
			case "textures":
				this._level.setShowCollisions(false);
				this._buttonTextures.active = true;
				break
			default:
				throw "value must be 'collisions' or 'textures'."
		}

		this._syncButtons();
	}

	_syncButtons() {
		if(this._playing) {
			var buttons = [this._buttonPlay, this._buttonShowCollisions];
			Interface.Input.buttons = buttons;
		}
		else {
			var bottomButtons = [];
			switch(this._mode) {
				case "collisions":
					bottomButtons = [this._buttonCreateCollisionBox, this._buttonCreateHalfTangible]
					break;
				case "textures":
					bottomButtons = [this._buttonCreateTexture]
					break;
			}
			if(this.getSelectThing() != null && ["collisionbox", "half-tangible", "texture"].indexOf(this.getSelectThing()._type) != -1) {
				bottomButtons.push(this._buttonRemoveSelected);
			}
			Interface.Input.buttons = [this._buttonPlay, this._buttonCollisions, this._buttonTextures, this._buttonLoad, this._buttonSave, ...bottomButtons];
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

	_create(type) {
		const side = EDITOR_GRID_SIZE * 2;
		var camera = this._level.getCameraTopLeft()
		var obj = [
			camera[0] + CANVAS_WIDTH  / 2 - side / 2,
			camera[1] + CANVAS_HEIGHT / 2 - side / 2];
		if(type != "texture") {
			obj.push(side);
			if(type == "collisionbox")
				obj.push(side);
		}
		var this_ = this;
		function setSelectThing(obj) {
			this_.setSelectThing(new SelectThing(obj));
		}
		switch(type) {
			case "collisionbox":
				this._level.collision.collisionBoxes.push(obj);
				setSelectThing(obj);
				break;
			case "half-tangible":
				this._level.collision.halfTangibles.push(obj);
				setSelectThing(obj);
				break;
			case "texture":
				var tx = this._askTexture((image) => {
					this._level.textures.add(image, obj[0], obj[1], image.width, image.height);
					setSelectThing(this._level.textures.texs.at(-1))
				});
				break;
		}
	}

	_askTexture(after) {
		var asktextureEl = document.getElementById("asktexture");
		var elClone = asktextureEl.cloneNode(true);
		asktextureEl.parentNode.replaceChild(elClone, asktextureEl);

		document.getElementById("asktexture").addEventListener("submit", () => {
			event.preventDefault();
			document.body.dataset.asktexture = "off";
			var files = document.getElementById("asktexture_file").files;
			if(files.length < 1) {
				alert("Aucun fichier importé.")
				return;
			}
			if(files.length > 1) {
				alert("Un seul fichier peut être importé en une seule fois.")
				return;
			}
			var file = files[0];
			createImageBitmap(file).then((image) => after(image));
		});

		document.getElementById("asktexture_cancel").addEventListener("click", (event) => {
			document.body.dataset.asktexture = "off";
			event.preventDefault();
		});

		document.body.dataset.asktexture = "on";
	}

	getSelectThing() {
		return this._selectThing;
	}

	setSelectThing(value) {
		this._selectThing = value;
		this._syncButtons();
	}

	unsetSelectThing() {
		this.setSelectThing(null);
	}

	_switchShowCollisionsWhilePlaying() {
		this._level.setShowCollisions(!this._level.showCollisions);
		this._buttonShowCollisions.active = this._level.showCollisions;
	}
}