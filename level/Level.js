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
		this.collision = new Collision([ [-100, 100, 200, 50], [50, 0, 150, 25], [150, -50, 150, 50], [500, -50, 150, 50] ], [ [-150, 10, 100], [-300, 0, 150], [-300, -80, 150], [-300, -160, 150] ]);
		Interface.Output.addObject(this.collision);
		this.avatar = new Avatar(0 - AVATAR_WIDTH / 2, -200, this);
		Interface.Output.addObject(this.avatar);
	}

	/**
	 * Appelé à chaque tick
	 */
	tick() {
		this.avatar.tick();

		// Caméra suit l'avatar
		this.cameraX = this.avatar.x - this.avatar.width / 2;
		this.cameraY = this.avatar.y - this.avatar.height / 2;

		Interface.Output.draw(this.cameraX, this.cameraY);
	}
}