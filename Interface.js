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
		rightPressed = false;     // true si la touche est pressée
		leftPressed = false;      //
		upPressed = false;        //
		leftClickPressed = false; //
		mouseX = 0; // position actuelle du pointeur
		mouseY = 0; // 

		_leftClick = false;
		/**
		 * Retourne true si il y a eu un clic gauche et qu'il n'a pas encore été get.
		 */
		static getLeftClick() {
			var r = Interface.Input._leftClick;
			Interface.Input._leftClick = false;
			return r;
		}

		/**
		 * A appeler une seule fois pour préparer les évènements pour recevoir chaque entrée.
		 */
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
					case "(LeftClick)":
						Interface.Input.leftClickPressed = value;
						break;
				}
			}
			
			document.addEventListener("keydown", (event) => {
				set(event.key, true);
			});
			
			document.addEventListener("keyup", (event) => {
				set(event.key, false);
			});

			Interface.Output.CANVAS.addEventListener("mousedown", () => {
				set("(LeftClick)", true);
				Interface.Input._leftClick = true;
			});

			document.addEventListener("mouseup", () => {
				set("(LeftClick)", false);
			});

			document.addEventListener("mousemove", (e) => {
				var x = e.x - Interface.Output.CANVAS.offsetLeft;
				Interface.Input.mouseX = x;
				var y = e.y - Interface.Output.CANVAS.offsetLeft;
				Interface.Input.mouseY = y;
			});

			Interface.Input.buttons = [];
		}

		/**
		 * Doit être appelé à chaque tick.
		 */
		static tickButtons() {
			Interface.Input.buttons.forEach((button) => {
				button.tick();
			});
		}

		/**
		 * Doit être appelé à chaque tick.
		 */
		static drawButtons(ctx) {
			Interface.Input.buttons.forEach((button) => {
				button.draw(ctx);
			});
		}
	}

	/**
	 * Gère le dessin sur le canvas.
	 */
	static Output = class {
		// Elément HTML du canvas
		static CANVAS = document.getElementById("canvas");

		// Taille de l'affichage (à rendre responsive...)
		static width = 600;
		static height = 400;
		// Liste des boutons
		static buttons = [];

		/**
		 * Permet de recevoir le contexte du canvas
		 */ 
		static getContext() {
			var ctx = Interface.Output.CANVAS.getContext('2d');
			ctx.fillRectTrunc = (a,b,c,d) => {
				ctx.fillRect(Math.round(a), Math.round(b), Math.round(c), Math.round(d));
			};
			return ctx;
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