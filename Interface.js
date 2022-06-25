"use strict";

class Interface {
	static CANVAS = document.getElementById("canvas");

	static Input = class {
		rightPressed = false;
		leftPressed = false;
		upPressed = false;

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

	static width = 600;
	static height = 400;
	static visibleObjects = [];
	static sorted = true;

	static _getContext() {
		var ctx = Interface.CANVAS.getContext('2d');
		ctx.fillRectTrunc = (a,b,c,d) => {
			ctx.fillRect(Math.round(a), Math.round(b), Math.round(c), Math.round(d));
		};
		return ctx;
	}

	static _sort() {
		Interface.visibleObjects.sort((obj1, obj2) => {
			return obj2.getZ() - obj1.getZ();
		});
		Interface.sorted = true;
	}

	static draw(cameraX, cameraY) {
		var offsetX = cameraX - Interface.width / 2;
		var offsetY = cameraY - Interface.height / 2;

		Interface.CANVAS.width = Interface.width;
		Interface.CANVAS.height = Interface.height;

		if(!Interface.sorted)
			Interface._sort();

		var ctx = Interface._getContext();
		ctx.fillColor = "#000000";
		ctx.fillRect(0, 0, Interface.width, Interface.height);
		Interface.visibleObjects.forEach((obj) => {
			obj.draw(ctx, offsetX, offsetY);
		});
	}

	static addObject(obj) {
		Interface.visibleObjects.push(obj);
		Interface.sorted = false;
	}

	static reset() {
		Interface.visibleObjects = [];
		Interface.sorted = true;
	}
}

Interface.Input.init();