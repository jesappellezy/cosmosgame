/**
 * Juste un petit bouton carré de 30*30 qui a un caractère en office d'image.
 */
class CharButton extends Button {
	/**
	 * x, y: position du bouton
	 * char: petit texte affiché sur le bouton
	 * fontSize: taille du texte
	 * yPos: position verticale du texte (autour de 20)
	 * active: si le bouton parait pressé
	 */
	constructor(x, y, char, fontSize, yPos, f, active = false) {
		super(x, y, 30, 30, assets.Editor.button, f, active, assets.Editor.buttonHover, assets.Editor.buttonActive);
		this._char = char;
		this._fontSize = fontSize;
		this._yPos = yPos;
	}

	draw(ctx) {
		super.draw(ctx);
		window.uuu = ctx;
		ctx.textAlign = "center";
		ctx.fillStyle = "#ffffff";
		ctx.font = String(this._fontSize) + "px sans-serif";
		ctx.fillText(this._char, this._x + 15, this._y + this._yPos);
	}
}