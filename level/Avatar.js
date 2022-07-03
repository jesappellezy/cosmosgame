"use strict";

/**
 * Représente l'avatar contrôlé par le joueur
 */
class Avatar {
	// Position dans le niveau
	x;
	y;
	// Taille de l'avatar (normalement égal à AVATAR_WIDTH et AVATAR_HEIGHT dans consts.js)
	width;
	height;
	// Vitesse actuelle de l'avatar (0, 0 si il bouge pas)
	speedX;
	speedY;
	// S'il est actuellement debout sur le sol
	onFloor;
	// La partie dans lequel est actuellement l'avatar
	level;

	/**
	 * x et y: float
	 *   Position de départ de l'avatar
	 * game: Game
	 *   Partie dans lequel est actuellement l'avatar
	 */
	constructor(x, y, level) {
		this.x = x;
		this.y = y;
		this.width = AVATAR_WIDTH;
		this.height = AVATAR_HEIGHT;
		this.speedX = 0; // en px/s
		this.speedY = 0; // en px/s
		this.onFloor = false;
		this.upPressed = true;

		this.level = level;
	}

	/**
	 * Dessine l'avatar à chaque tick.
	 * ctx: Context
	 *   Contexte du canvas
	 * offsetX, offsetY
	 *   Vecteur à soustraire de la position de l'avatar pour le dessiner au bon endroit
	 */
	draw(ctx, offsetX, offsetY) {
		ctx.fillStyle = AVATAR_COLOR;
		ctx.fillRectTrunc(
			this.x - offsetX,
			this.y - offsetY,
			this.width,
			this.height
			);
	}

	/**
	 * Retourne le Z de l'objet (voir README.md)
	 */
	getZ() {
		return [0, 1];
	}

	/**
	 * Fonction appelée à chaque tick quand on est en jeu.
	 */
	tick() {
		// DETERMINE LA NOUVELLE VITESSE
		// sur y
		this.speedY += GRAVITY * DELAY_BETWEEN_TICKS;
		if(this.onFloor && Interface.Input.upPressed && !this.upPressed) {
			this.speedY = -AVATAR_JUMPFORCE;
		}
		if(Interface.Input.upPressed && !this.upPressed)
			this.upPressed = true;
		else if(this.upPressed && !Interface.Input.upPressed)
			this.upPressed = false;

		// sur x
		if(Interface.Input.rightPressed && !Interface.Input.leftPressed) {
			// Accélérer vers la droite
			this.speedX += AVATAR_ACCELERATION * DELAY_BETWEEN_TICKS;
			if(this.speedX > AVATAR_MAXSPEED) {
				this.speedX = AVATAR_MAXSPEED;
			}
		}
		else if(Interface.Input.leftPressed && !Interface.Input.rightPressed) {
			// Accélérer vers la gauche
			this.speedX -= AVATAR_ACCELERATION * DELAY_BETWEEN_TICKS;
			if(this.speedX < -AVATAR_MAXSPEED) {
				this.speedX = -AVATAR_MAXSPEED;
			}
		}
		else if(this.speedX != 0) {
			// Freiner
			var freinerVersLaDroite = this.speedX < 0;
			if(freinerVersLaDroite)
				this.speedX += AVATAR_ACCELERATION * DELAY_BETWEEN_TICKS;
			else
				this.speedX -= AVATAR_ACCELERATION * DELAY_BETWEEN_TICKS;
			if(
				(freinerVersLaDroite && this.speedX > 0) ||
				(!freinerVersLaDroite && this.speedX < 0)
			) {
				this.speedX = 0;
			}
		}

		// FAIT BOUGER L'AVATAR
		var moveX = this.speedX * DELAY_BETWEEN_TICKS;
		var moveY = this.speedY * DELAY_BETWEEN_TICKS;
		// détecte les collisions
		var hit = this.level.collision.verifyMove([this.x, this.y, this.width, this.height], moveX, moveY);
		this.x = hit.newPos.x;
		this.y = hit.newPos.y;
		if(hit.stopX)
			this.speedX = 0;
		if(hit.stopY)
			this.speedY = 0;
		this.onFloor = hit.onFloor;

		// Remet l'avatar à une position de base quand il tombe trop bas (temporaire)
		if(this.y > 1600) {
			this.level.reset();
		}
	}
}