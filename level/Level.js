"use strict";

/**
 * Représente un niveau.
 */
class Level {
	// Position de la caméra (qui suit l'avatar)
	cameraX;
	cameraY;
	// Collisions du niveau (objet Collision)
	collision;
	// Avatar du niveau (objet Avatar)
	avatar;

	/**
	 * (un jour faudra mettre en entrée des trucs pour faire des niveaux différents)
	 */
	constructor() {
		this._baseX = 0 - AVATAR_WIDTH / 2;
		this._baseY = -200

		this.collision = new Collision([ [-100, 100, 200, 50], [50, 0, 150, 25], [150, -50, 150, 50], [500, -50, 150, 50] ], [ [-150, 10, 100], [-300, 0, 150], [-300, -80, 150], [-300, -160, 150] ]);

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

		var offsetX = this.cameraX - Interface.Output.width / 2;
		var offsetY = this.cameraY - Interface.Output.height / 2;

		Interface.Output.CANVAS.width = Interface.Output.width;
		Interface.Output.CANVAS.height = Interface.Output.height;

		ctx.fillColor = "#000000";
		ctx.fillRect(0, 0, Interface.Output.width, Interface.Output.height);
		this._visibleObjects.forEach((obj) => {
			obj.draw(ctx, offsetX, offsetY);
		});
	}

	/**
	 * Recommence le niveau.
	 */
	reset() {
		this.avatar = new Avatar(this._baseX, this._baseY, this);
		this._visibleObjects = [this.collision, this.avatar];
		this._sorted = false;
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