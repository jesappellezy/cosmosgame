"use strict";

/**
 * Représente l'interface utilisateur (je sais pas si c'est le bon mot mdr)
 * Permet de dessiner sur le canvas et de recevoir les entrées clavier.
 */
class Interface {

	/**
	 * Gère les entrées clavier.
	 * Par exemple, si on veut savoir si la touche droite est actuellement pressée, on fait :
	 *   Interface.Input.rightPressed
	 */
	static Input = class {
		rightPressed = false; // ... private
		leftPressed = false;
		upPressed = false;

		// A appeler une seule fois pour préparer les évènements pour recevoir chaque entrée.
		static init() {
			function set(key, value) {
				switch(key) {
					case "ArrowRight":
						Interface.Input.rightPressed = value;
						break;
					case "ArrowLeft":
						Interface.Input.leftPressed = value;
						break;
					case "ArrowUp":
						Interface.Input.upPressed = value;
						break;
				}
			}
			
			document.addEventListener("keydown", (event) => {
				set(event.key, true);
			});
			
			document.addEventListener("keyup", (event) => {
				set(event.key, false);
			});
		}
	}

	/**
	 * Gère le dessin sur le canvas.
	 */
	static Output = class {
		// Elément HTML du canvas
		static CANVAS = document.getElementById("canvas");

		// Taille de l'affichage (à rendre responsive)
		static width = 600;
		static height = 400;
		// Liste des boutons
		static buttons = [];
		// Liste des objets visibles dans un niveau (ils doivent avoir une fonction `draw()` qui reçcoit un argument pour le contexte du canvas)
		static _visibleObjects = [];
		// Si visibleObjects est actuellement dans l'ordre d'affichage (les objets en avant en dernier)
		static _sorted = true;

		/**
		 * Permet de recevoir le contexte du canvas
		 */ 
		static _getContext() {
			var ctx = Interface.Output.CANVAS.getContext('2d');
			ctx.fillRectTrunc = (a,b,c,d) => {
				ctx.fillRect(Math.round(a), Math.round(b), Math.round(c), Math.round(d));
			};
			return ctx;
		}

		/**
		 * Met les objets dans l'ordre selon le Z (voir README.md)
		 */
		static _sort() {
			Interface.Output._visibleObjects.sort((obj1, obj2) => {
				var z1 = obj1.getZ();
				var z2 = obj2.getZ()
				if(z1[0] == z2[0]) 
					return z1[1] - z2[1];
				else
					return z1[0] - z2[0];
			});
			Interface.Output.sorted = true;
		}

		/**
		 * Dessine tous les objets visibles dans un niveau.
		 */
		static draw(cameraX, cameraY) {
			if(!Interface.Output.sorted)
				Interface.Output._sort();

			var offsetX = cameraX - Interface.Output.width / 2;
			var offsetY = cameraY - Interface.Output.height / 2;

			Interface.Output.CANVAS.width = Interface.Output.width;
			Interface.Output.CANVAS.height = Interface.Output.height;


			var ctx = Interface.Output._getContext();
			ctx.fillColor = "#000000";
			ctx.fillRect(0, 0, Interface.Output.width, Interface.Output.height);
			Interface.Output._visibleObjects.forEach((obj) => {
				obj.draw(ctx, offsetX, offsetY);
			});
		}

		/**
		 * Ajouter un/des objets à afficher.
		 * arguments: Objets visibles (avec les fonctions `.draw(ctx, offsetX, offsetY)` et `.getZ()`).
		 */
		static addVisibleObject() {
			[...arguments].forEach((obj) => {
				this._visibleObjects.push(obj);
			});
			this._sorted = false;
		}

		/**
		 * Supprimer tous les objets à afficher.
		 */
		static removeVisibleObjects() {
			this._visibleObjects = [];
		}
	}
}

Interface.Input.init();