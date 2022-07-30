"use strict";

/**
 * Textures à placer dans le niveau
 */
class Textures {
	texs;

	constructor(texs = []){
		this.texs = texs;
	}

	add(image,x,y,width,height){
		var tx={
			image: image,
			x: x,
			y: y,
			width: width,
			height: height}
		this.texs[this.texs.length]=tx
	}

	/**
	 * fonction de dessin
	 */
	draw(ctx, cameraX, cameraY){
		this.texs.forEach((tx) => {
			ctx.drawImage(tx.image, tx.x - cameraX, tx.y - cameraY);
		});
	}

	/**
	 * Retourne le Z de l'objet (voir README.md)
	 */
	getZ() {
		return [0, 0];
	}
}
