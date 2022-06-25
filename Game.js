"use strict";

class Game {
	cameraX;
	cameraY;
	collision;
	avatar;

	constructor() {
		this.collision = new Collision([ [-100, 100, 200, 50], [50, 0, 150, 25], [150, -50, 150, 50], [500, -50, 150, 50] ]);
		Interface.addObject(this.collision);
		this.avatar = new Avatar(0 - AVATAR_WIDTH / 2, -200, AVATAR_WIDTH, AVATAR_HEIGHT, this);
		Interface.addObject(this.avatar);
	}

	tick() {
		this.avatar.tick();
		this.cameraX = this.avatar.x - this.avatar.width / 2;
		this.cameraY = this.avatar.y - this.avatar.height / 2;
		Interface.draw(this.cameraX, this.cameraY);
	}
}