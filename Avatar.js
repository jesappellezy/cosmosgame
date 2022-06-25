"use strict";

class Avatar {
	x;
	y;
	width;
	height;
	speedX;
	speedY;
	game;
	onFloor;

	constructor(x, y, width, height, game) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speedX = 0; // en px/s
		this.speedY = 0; // en px/s
		this.onFloor = false;

		this.game = game;
	}

	draw(ctx, offsetX, offsetY) {
		ctx.fillStyle = AVATAR_COLOR;
		ctx.fillRectTrunc(
			this.x - offsetX,
			this.y - offsetY,
			this.width,
			this.height
			);
	}

	getZ() {
		return 0;
	}

	tick() {
		// VITESSE
		// sur y
		this.speedY += GRAVITY * DELAY_BETWEEN_TICKS;
		if(this.onFloor && Interface.Input.upPressed) {
			this.speedY = -AVATAR_JUMPFORCE;
		}

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

		// MOUVEMENT
		var moveX = this.speedX * DELAY_BETWEEN_TICKS;
		var moveY = this.speedY * DELAY_BETWEEN_TICKS;
		// détecte les collisions
		var hit = this.game.collision.verifyMove([this.x, this.y, this.width, this.height], moveX, moveY);
		this.x = hit.newPos.x;
		this.y = hit.newPos.y;
		if(hit.stopX)
			this.speedX = 0;
		if(hit.stopY)
			this.speedY = 0;
		this.onFloor = hit.onFloor;

		// ...
		if(this.y > 400) {
			this.x = 0 - AVATAR_WIDTH / 2;
			this.y = -200;
			this.speedX = 0;
			this.speedY = 0;
		}
	}
}