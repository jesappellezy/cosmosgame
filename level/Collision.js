"use strict";

/**
 * Représente un ensemble de boîtes de collision.
 */
class Collision {
	_collisionBoxes;
	_halfTangibles;

	/**
	 * collisionBoxes: Array of Array
	 *   Liste des boîtes de collisions.
	 *   Une boîte de collision c'est une liste de 4 valeurs :
	 *     [positionX, positionY, largeur, hauteur]
	 * halfTangibles: Array of Array
	 *   Liste des plateformes semi-tangibles.
	 *   Une plateforme semi-tangible c'est une liste de 3 valeurs :
	 *     [positionX, positionY, largeur]
	 */
	constructor(collisionBoxes, halfTangibles) {
		this._collisionBoxes = collisionBoxes;
		this._halfTangibles = halfTangibles;
	}

	/**
	 * Dessine les boîtes de collisions à chaque tick (quand celles-ci sont affichées).
	 * ctx: Context
	 *   Contexte du canvas
	 * offsetX, offsetY
	 *   Vecteur à soustraire de la position de l'avatar pour le dessiner au bon endroit
	 */
	draw(ctx, offsetX, offsetY) {
		ctx.fillStyle = COLLISION_COLOR;
		this._collisionBoxes.forEach((box) => {
			ctx.fillRectTrunc(box[0] - offsetX, box[1] - offsetY, box[2], box[3]);
		});
		ctx.fillStyle = HALF_TANGIBLE_COLOR;
		this._halfTangibles.forEach((st) => {
			ctx.fillRectTrunc(st[0] - offsetX, st[1] - offsetY, st[2], HALF_TANGIBLE_HEIGHT);
		});
	}

	/**
	 * Retourne le Z de l'objet (voir README.md)
	 */
	getZ() {
		return [0, 0];
	}

	/**
	 * Calcule les collisions et tout bref après des heures d'acharnement ça fonctionne bien on peut laisser comme ça :')
	 */
	verifyMove(box, moveX, moveY) {

		var onFloor = false;

		var posX = box[0] + moveX;
		var posY = box[1] + moveY;
		var baseMoveX = moveX;
		var baseMoveY = moveY;
		var basePosX = posX;
		var basePosY = posY;

		// plateformes semi-tangibles

		if (moveY > 0) {
			this._halfTangibles.forEach((halfTangible) => {
				if(
					halfTangible[0] + halfTangible[2] > box[0] &&
					box[0] + box[2] > halfTangible[0] &&
					box[1] + box[3] <= halfTangible[1] &&
					box[1] + box[3] + moveY >= halfTangible[1]
					) {
					posY = halfTangible[1] - box[3];
					moveX = posX - box[0];
					moveY = posX - box[0];
					onFloor = true;
				}
			})
		}

		// boîtes de collision

		this._collisionBoxes.forEach((box2) => {
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
				(basePosY > posY && baseMoveY > 0) ||
				onFloor,
			onFloor: onFloor
		};
	}

	getCollisionBoxes() {
		return this._collisionBoxes;
	}

	getHalfTangibles() {
		return this._halfTangibles;
	}
}
