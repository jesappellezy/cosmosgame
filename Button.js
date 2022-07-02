"use strict";

/**
 * Bouton à afficher sur l'écran, qu'il faudra ajouter à la liste Interface.Input.buttons.
 */
class Button {
	/**
	 * x, y: position du bouton sur l'écran
	 * width, height: boîte de collision du bouton
	 * image: image affichée par défaut
	 * f: fonction exécutée quand cliqué
	 * active: détermine this.active, true si le bouton doit paraitre pressé. Influe uniquement sur son apparence.
	 * imageHover: image quand la souris passe sur le bouton. 
	 * imageActive: image quand this.active est true.
	 */
	constructor(x, y, width, height, image, f, active = false, imageHover = null, imageActive = null) {
		if(imageHover == null)
			imageHover = image;
		if(imageActive == null)
			imageActive = image;
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
		this._image = image;
		this._imageHover = imageHover;
		this._imageActive = imageActive;
		this._f = f;
		this.active = active
	}

	/**
	 * Appelé à chaque tick.
	 */
	tick() {
		if(this._isMouseHover() && Interface.Input.getLeftClick())
			this._f();
	}

	/**
	 * Dessine l'image.
	 * ctx: Context
	 */
	draw(ctx) {
		var image = this.active ? this._imageActive : (this._isMouseHover() ? this._imageHover : this._image);
		ctx.drawImage(image, this._x, this._y, this._width,this._height);
	}

	_isMouseHover() {
		var x = Interface.Input.mouseX;
		var y = Interface.Input.mouseY;
		return (
			x >= this._x &&
			y >= this._y &&
			x < this._x + this._width &&
			y < this._y + this._height
			);
	}
}