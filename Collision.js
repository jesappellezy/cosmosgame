"use strict";

class Collision {
	collisionBoxes;
	constructor(collisionBoxes) {
		this.collisionBoxes = collisionBoxes;
	}

	draw(ctx, offsetX, offsetY) {
		ctx.fillStyle = COLLISION_COLOR;
		this.collisionBoxes.forEach((box) => {
			ctx.fillRectTrunc(box[0] - offsetX, box[1] - offsetY, box[2], box[3]);
		});
	}

	getZ() {
		return 0;
	}

	verifyMove(box, moveX, moveY) {
		var posX = box[0] + moveX;
		var posY = box[1] + moveY;
		var baseMoveX = moveX;
		var baseMoveY = moveY;
		var basePosX = posX;
		var basePosY = posY;

		var onFloor = false;

		// this.collisionBoxes.forEach((box2) => {
		// 	// Vérifier sur X
		// 	if(moveX < 0) {
		// 		if(
		// 			box2[1] - box[3] < box[1] &&
		// 			box[1] < box2[1] + box2[3] &&
		// 			box[0] >= box2[0] + box2[2] &&
		// 			box[0] + moveX <= box2[0] + box2[2]
		// 		) {
		// 			moveX -= posX - (box2[0] + box2[2]);
		// 			posX = box2[0] + box2[2];
		// 		}
		// 	}
		// 	else if(moveX > 0) {
		// 		if(
		// 			box2[1] - box[3] < box[1] &&
		// 			box[1] < box2[1] + box2[3] &&
		// 			box[0] <= box2[0] - box[2] &&
		// 			box[0] + moveX >= box2[0] - box[2]
		// 		) {
		// 			moveX -= posX - (box2[0] - box2[2]);
		// 			posX = box2[0] - box[2];
		// 		}
		// 	}
		// });

		// this.collisionBoxes.forEach((box2) => {
		// 	// Vérifier sur Y
		// 	if(moveY < 0) {
		// 		if(
		// 			box2[0] - box[2] < box[0] &&
		// 			box[0] < box2[0] + box2[2] &&
		// 			box[1] >= box2[1] + box2[3] &&
		// 			box[1] + moveY <= box2[1] + box2[3]
		// 		) {
		// 			moveY -= posY - (box2[1] + box2[3]);
		// 			posY = box2[1] + box2[3];
		// 		}
		// 	}
		// 	else if(moveY > 0) {
		// 		if(
		// 			box2[0] - box[2] < box[0] &&
		// 			box[0] < box2[0] + box2[2] &&
		// 			box[1] <= box2[1] - box[3] &&
		// 			box[1] + moveY >= box2[1] - box[3]
		// 		) {
		// 			moveY -= posY - (box2[1] - box2[3]);
		// 			posY = box2[1] - box[3];
		// 			onFloor = true;
		// 		}
		// 	}
		// });

		this.collisionBoxes.forEach((box2,i) => {
			if(
				posX < box2[0] + box2[2] &&
				box2[0] < posX + box[2] &&
				posY < box2[1] + box2[3] &&
				box2[1] < posY + box[3]
				) {
				var BoxUpSide_Box2DownSide = Math.abs(posY - (box2[1] + box2[3]));
				var BoxDownSide_Box2UpSide = Math.abs(box2[1] - (posY + box[3]));
				var BoxLeftSide_Box2RightSide = Math.abs(posX - (box2[0] + box2[2]));
				var BoxRightSide_Box2LeftSide = Math.abs(box2[0] - (posX + box[2]));
				var l = [BoxUpSide_Box2DownSide, BoxDownSide_Box2UpSide,
					BoxLeftSide_Box2RightSide, BoxRightSide_Box2LeftSide];
				switch(l.indexOf(Math.min(...l))) {
					case 0:
						posY = box2[1] + box2[3];
						break;
					case 1:
						posY = box2[1] - box[3];
						onFloor = true;
						break;
					case 2:
						posX = box2[0] + box2[2];
						break;
					case 3:
						posX = box2[0] - box[2];
						break;
				}
				moveX = posX - box[0];
				moveY = posX - box[0];
			}
		});

		return {
			newPos: {x: posX, y: posY},
			stopX:
				(basePosX < posX && baseMoveX < 0) ||
				(basePosX > posX && baseMoveX > 0),
			stopY:
				(basePosY < posY && baseMoveY < 0) ||
				(basePosY > posY && baseMoveY > 0),
			onFloor: onFloor
		};
	}
}