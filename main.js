"use strict";

// Appelle tickObject.tick() et tickObject.draw(ctx) en boucle.
function main() {
	function tick() {
		tickObject.tick();
		Interface.Input.getLeftClick();

		var ctx = Interface.Output.getContext();
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		tickObject.draw(ctx);
	}

	window.tickObject = new Editor(new Level());
	
	// Boucle
	var startTime = Date.now();
	function loop() {
		logTimeDoingThis(() => tick());
		var endTime = Date.now();
	
		startTime += DELAY_BETWEEN_TICKS*1000;
		if(startTime < endTime) {
			// La frame a pris trop de temps
			startTime = Date.now();
			setTimeout(loop, 0);
		}
		else {
			setTimeout(loop, startTime - Date.now())
		}
	}
	loop();
}

loadAssets(() => main());

function logTimeDoingThis(f) {
	var startTime = Date.now();
	var r = f();
	var endTime = Date.now();
	var p = (endTime-startTime) / (DELAY_BETWEEN_TICKS*1000) * 100;
	if (p < 100) console.log(p, "%");
	else console.error(p, "%");
	return r;
}