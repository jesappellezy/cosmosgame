"use strict";

/**
 * Représente un niveau.
 */
class Level {
	constructor(showCollisions = false, baseX = 0, baseY = -200, collision = new Collision([], [ [-240, 0, 600] ]), textures = new Textures()) {
		this._baseX = baseX;
		this._baseY = baseY;

		this.collision = collision;
		this.textures = textures;
		this.showCollisions = showCollisions;

		this.reset();
		this._cameraFollowsAvatar();
	}

	/**
	 * Appelé à chaque tick quand on est en jeu
	 */
	tick() {
		this.avatar.tick();

		this._cameraFollowsAvatar();
	}

	/**
	 * Appelé à chaque tick pour dessiner le niveau
	 */
	draw(ctx) {
		if(!this.sorted)
			this._sort();

		var camera = this.getCameraTopLeft();

		this._visibleObjects.forEach((obj) => {
			obj.draw(ctx, camera[0], camera[1]);
		});
	}

	/**
	 * Recommence le niveau.
	 */
	reset() {
		this.avatar = new Avatar(this._baseX, this._baseY, this);
		this.setShowCollisions(this.showCollisions);
		this._sorted = false;
	}

	/**
	 * Affiche les collisions ?
	 * value: bool
	 */
	setShowCollisions(value) {
		this.showCollisions = value;
		this._visibleObjects = [this.textures, this.avatar];
		if(this.showCollisions)
			this._visibleObjects.push(this.collision);
	}

	/**
	 * Retourne la position du point haut-gauche de la caméra.
	 */
	getCameraTopLeft() {
		return [this.cameraX - CANVAS_WIDTH / 2, this.cameraY - CANVAS_HEIGHT / 2];
	}

	/**
	 * Met les objets dans l'ordre selon le Z (voir README.md)
	 */
	_sort() {
		this._visibleObjects.sort((obj1, obj2) => {
			var z1 = obj1.getZ();
			var z2 = obj2.getZ()
			if(z1[0] == z2[0]) 
				return z1[1] - z2[1];
			else
				return z1[0] - z2[0];
		});
		this.sorted = true;
	}

	/**
	 * Place la caméra sur l'avatar
	 */
	_cameraFollowsAvatar() {
		this.cameraX = this.avatar.x + this.avatar.width / 2;
		this.cameraY = this.avatar.y + this.avatar.height / 2;
	}
}